export const baseURL = import.meta.env.VITE_BASE_URL;

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;
const POLLING_API_URL = import.meta.env.VITE_POLLING_API_URL;
const RESPONSE_API_URL = import.meta.env.VITE_RESPONSE_API_URL;

export const summaryApiAuth = {
  register: {
    url: `${AUTH_API_URL}/register`,
    method: "post",
  },
  login: {
    url: `${AUTH_API_URL}/login`,
    method: "post",
  },
  logout: {
    url: `${AUTH_API_URL}/logout`,
    method: "post",
  },
  refreshToken: {
    url: `${AUTH_API_URL}/refresToken`,
    method: "post",
  },
  updateDetails: {
    url: `${AUTH_API_URL}/updateDetails`,
    method: "patch",
  },
  getMe: {
    url: `${AUTH_API_URL}/getMe`,
    method: "get",
  },
  deleteUser: {
    url: `${AUTH_API_URL}/delete`,
    method: "post",
  },
};

export const summaryApiPolling = {
  createPoll: {
    url: `${POLLING_API_URL}/createPoll`,
    method: "post",
  },
  createQuestion: {
    url: `${POLLING_API_URL}/createQuestion`,
    method: "post",
  },
  finalSubmission: {
    url: `${POLLING_API_URL}/finalSubmission`,
    method: "post",
  },
  getPoll: {
    url: `${POLLING_API_URL}/getPoll`,
    method: "get",
  },
  updatePoll: {
    url: `${POLLING_API_URL}/updatePoll`,
    method: "patch",
  },
  myPolls: {
    url: `${POLLING_API_URL}/myPolls`,
    method: "get",
  },
  deletePoll: {
    url: `${POLLING_API_URL}/deletePoll`,
    method: "delete",
  },
  deleteQuestion: {
    url: `${POLLING_API_URL}/deleteQuestion`,
    method: "delete",
  },
};

export const summaryApiResponse = {
  submitPoll: {
    url: `${RESPONSE_API_URL}/submitPoll`,
    method: "post",
  },
  expirePoll: {
    url: `${RESPONSE_API_URL}/expirePoll`,
    method: "post",
  },
  results: {
    url: `${RESPONSE_API_URL}/results`,
    method: "get",
  },
  completedPoll: {
    url: `${RESPONSE_API_URL}/completedPolls`,
    method: "get",
  },
  analyticsPoll: {
    url: `${RESPONSE_API_URL}/analytics`,
    method: "get",
  },
};
