import { summaryApiPolling } from "../common/SummaryApi";
import { axiosRequest } from "../utils/axios";
import { axiosError } from "../utils/axiosError";
import { tokenStore } from "../utils/tokenStore";

const getToken = () => tokenStore.getAccessToken();

export const pollService = {
  async createPoll(pollData) {
    try {
      const response = await axiosRequest({
        ...summaryApiPolling.createPoll,
        data: pollData,
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    } catch (error) {
      axiosError(error);
    }
  },

  async createQuestion(pollId, questionData) {
    try {
      const response = await axiosRequest({
        url: `${summaryApiPolling.createQuestion.url}/${pollId}`,
        method: "post",
        data: questionData,
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    } catch (error) {
      axiosError(error);
    }
  },

  async finalSubmission(pollId) {
    try {
      const response = await axiosRequest({
        url: `${summaryApiPolling.finalSubmission.url}/${pollId}`,
        method: "post",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    } catch (error) {
      axiosError(error);
    }
  },

  async getPoll(pollId) {
    try {
      const response = await axiosRequest({
        url: `${summaryApiPolling.getPoll.url}/${pollId}`,
        method: "get",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    } catch (error) {
      axiosError(error);
    }
  },

  async updatePoll(id, data) {
    try {
      const response = await axiosRequest({
        url: `${summaryApiPolling.updatePoll.url}/${id}`,
        method: "patch",
        data,
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    } catch (error) {
      axiosError(error);
    }
  },

  async myPolls() {
    try {
      const user = tokenStore.getUser();
      const response = await axiosRequest({
        url: `${summaryApiPolling.myPolls.url}/${user?.id}`,
        method: "get",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    } catch (error) {
      axiosError(error);
    }
  },

  async deletePoll(id) {
    try {
      const response = await axiosRequest({
        url: `${summaryApiPolling.deletePoll.url}/${id}`,
        method: "delete",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    } catch (error) {
      axiosError(error);
    }
  },

  async deleteQuestion(id) {
    try {
      const response = await axiosRequest({
        url: `${summaryApiPolling.deleteQuestion.url}/${id}`,
        method: "delete",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    } catch (error) {
      axiosError(error);
    }
  },
};
