import { summaryApiResponse } from "../common/SummaryApi";
import { axiosRequest } from "../utils/axios";
import { axiosError } from "../utils/axiosError";
import { tokenStore } from "../utils/tokenStore";

const getToken = () => tokenStore.getAccessToken();

export const responseService = {
  async submitPoll(pollId, answers) {
    try {
      const response = await axiosRequest({
        url: `${summaryApiResponse.submitPoll.url}/${pollId}`,
        method: "post",
        data: { answers },
        headers: { Authorization: `Bearer ${getToken()}` },
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
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    } catch (error) {
      axiosError(error);
    }
  },

  async results(pollLink) {
    try {
      const response = await axiosRequest({
        url: `${summaryApiResponse.results.url}/${encodeURIComponent(pollLink)}`,
        method: "get",
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
        headers: { Authorization: `Bearer ${getToken()}` },
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
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    } catch (error) {
      axiosError(error);
    }
  },
};
