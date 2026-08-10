import axios from "axios";

export const getErrorMessage = (error: unknown): string => {
  // if (axios.isCancel(error))
  // {
    
  // }


  if (axios.isAxiosError(error)) {
    const serverMessage = error.response?.data?.detail;
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
