import {toast} from "sonner"

export const axiosError = (error) => {
    toast.error(
        error?.response?.data?.message
    )
}
