import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || undefined;
let failedRequestQueue: Array<{ resolve: Function; reject: Function }> = [];
let isRefreshingToken = false;

export const apiClient = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  withCredentials: true,
});

// Also handle concurrent failed requests:
// the first failed request intercepted lock refreshing token
// subsequent requests are queued in a Promise to be
// resolved/rejected based on the first request.
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status == 401 &&
      !originalRequest._hasRetried &&
      !originalRequest.url?.includes("/api/auth/refresh") //prevent infinite refresh loop
    ) {
      // Queue subsequent failed requests
      if (isRefreshingToken) {
        return new Promise((resolve, reject) => {
          failedRequestQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch((error) => {
            return Promise.reject(error);
          });
      }

      // Lock and handle first failed request
      originalRequest._hasRetried = true;
      isRefreshingToken = true;

      try {
        await apiClient.post("/api/auth/refresh");

        for (let request of failedRequestQueue) {
          request.resolve();
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        for (let request of failedRequestQueue) {
          request.reject(refreshError);
        }

        return Promise.reject(error);
      } finally {
        isRefreshingToken = false;
      }
    }

    return Promise.reject(error);
  },
);
