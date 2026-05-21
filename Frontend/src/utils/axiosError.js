import { toast } from "sonner";

export const axiosError = (error) => {
  const message =
    error?.response?.data?.message
    console.log("Error ?", message)

  toast.error(message);
  console.error("API Error:", message, error);
};
