import { summaryApiAuth } from "../common/SummaryApi";
import { axiosRequest } from "../utils/axios";
import { axiosError } from "../utils/axiosError";
import { tokenStore } from "../utils/tokenStore";

const accessToken = tokenStore.getAccessToken();

export const authService = {
  async userRegister(data) {
    try {
      const response = await axiosRequest({
        ...summaryApiAuth.register,
        data: data,
      });

      return response.data;
    } catch (error) {
      axiosError(error);
    }
  },

  async userLogin(data) {
    try {
      const response = await axiosRequest({
        ...summaryApiAuth.login,
        data: data,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      axiosError(error);
    }
  },

  async userLogout() {
    try {
      const response = await axiosRequest({
        ...summaryApiAuth.logout,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      axiosError(error);
    }
  },

  async user() {
    try {
      const response = await axiosRequest({
        ...summaryApiAuth.refreshToken,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      axiosError(error);
    }
  },

  async updateDetails(data) {
    try {
      const response = await axiosRequest({
        ...summaryApiAuth.updateDetails,
        data: data,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      axiosError(error);
    }
  },

  async getMe(id) {
    try {
      const response = await axiosRequest({
        url: `${summaryApiAuth.getMe.url}/${id}`,
        method: "post",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      axiosError(error);
    }
  },

  async deleteUser() {
    try {
      const response = await axiosRequest({
        ...summaryApiAuth.deleteUser,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      axiosError(error);
    }
  },
};
