import { summaryApiAuth } from "../common/SummaryApi";
import { axiosRequest } from "../utils/axios";
import { axiosError } from "../utils/axiosError";
import { tokenStore } from "../utils/tokenStore";

const getToken = () => tokenStore.getAccessToken();

export const authService = {
  async userRegister(data) {
    try {
      const response = await axiosRequest({
        ...summaryApiAuth.register,
        data,
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
        data,
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
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    } catch (error) {
      axiosError(error);
    }
  },

  async refreshToken() {
    try {
      const response = await axiosRequest({
        ...summaryApiAuth.refreshToken,
        headers: { Authorization: `Bearer ${getToken()}` },
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
        data,
        headers: { Authorization: `Bearer ${getToken()}` },
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
        method: "get",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    } catch (error) {
      axiosError(error);
    }
  },

  async deleteUser(id) {
    try {
      const response = await axiosRequest({
        url: `${summaryApiAuth.deleteUser.url}/${id}`,
        method: "delete",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    } catch (error) {
      axiosError(error);
    }
  },
};
