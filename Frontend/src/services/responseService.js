import { summaryApiResponse } from "../common/SummaryApi";
import { axiosRequest } from "../utils/axios";
import { axiosError } from "../utils/axiosError";
import { tokenStore } from "../utils/tokenStore";

const accessToken = tokenStore.getAccessToken();

export const responseService = {
  async submitPoll() {
    try {
      const response = await axiosRequest({
        ...summaryApiResponse.submitPoll,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      axiosError(error);
    }
  },

  async expirePoll(id) {
    try {
      const response = await axiosRequest({
        url: `${summaryApiResponse.expirePoll.url}/${id}`,
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

  async results(link) {
    try {
      const response = await axiosRequest({
        url: `${summaryApiResponse.results.url}/${link}`,
        method: "get",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      axiosError(error);
    }
  },

  async completedPoll() {
    try {
      const response = await axiosRequest({
        ...summaryApiResponse.completedPoll,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      axiosError(error);
    }
  },

  async analyticsPoll(id) {
    try {
      const response = await axiosRequest({
        url: `${summaryApiResponse.analyticsPoll.url}/${id}`,
        method: "get",
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
