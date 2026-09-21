import axios from "axios";

export const getErrorMessage = (error: unknown): string => {
  if (axios.isCancel(error)) {
    return "";
  }

  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;
    const serverMessage =
      typeof responseData === "string" ? responseData : responseData?.detail;
    if (serverMessage) {
      return serverMessage;
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
};
