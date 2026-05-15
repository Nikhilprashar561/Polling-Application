import { summaryApiPolling } from "../common/SummaryApi";
import { axiosRequest } from "../utils/axios";
import { axiosError } from "../utils/axiosError";
import { tokenStore } from "../utils/tokenStore";

const accessToken = tokenStore.getAccessToken();

export const pollService = {
  async createPoll(pollData) {
    try {
      const response = await axiosRequest({
        ...summaryApiPolling.createPoll,
        data: pollData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      axiosError(error);
    }
  },

  async createQuestion(questionData) {
    try {
      const response = await axiosRequest({
        ...summaryApiPolling.createQuestion,
        data: questionData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      axiosError(error);
    }
  },

  async finalSubmission(finalSubmissionData) {
    try {
      const response = await axiosRequest({
        ...summaryApiPolling.finalSubmission,
        data: finalSubmissionData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      axiosError(error);
    }
  },

  async getPoll(pollLink) {
    try {
      const response = await axiosRequest({
        url: `${summaryApiPolling.getPoll.url}/${pollLink}`,
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

  async updatePoll(id, data) {
    try {
      const response = await axiosRequest({
        url: `${summaryApiPolling.updatePoll.url}/${id}`,
        method: "patch",
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

  async myPolls(id) {
    try {
      const response = await axiosRequest({
        url: `${summaryApiPolling.myPolls.url}/${id}`,
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

  async deletePoll(id) {
    try {
      const response = await axiosRequest({
        url: `${summaryApiPolling.deletePoll.url}/${id}`,
        method: "delete",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
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
