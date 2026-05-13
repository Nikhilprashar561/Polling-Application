import axios from "axios";
import { tokenStore } from "./tokenStore.js";
import { summaryApiAuth } from "../common/SummaryApi.js";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const axiosRequest = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// For Each Request Interceptor Before sent

axios.interceptors.request.use(
  function (config) {
    const accessToken = tokenStore.getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// For Each Response Interceptor Before Received

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const status = error.response ? error.response.status : null;
    let originalRequest = error.config;

    if (status === 401 && !originalRequest.retry) {
      originalRequest.retry = true;

      const refreshToken = tokenStore.getRefreshToken();

      if (refreshToken) {
        const newAccessToken = await refreshAccessToken(refreshToken);

        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosRequest(originalRequest);
        }
      }
    }

    return Promise.reject(error);
  },
);

const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axiosRequest.post({
      ...summaryApiAuth.refreshToken,
      headers: {
        Authorization: `Bearer: ${refreshToken}`,
      },
    });

    const accessToken = response.data.data.accessToken;

    tokenStore.set({ accessToken: accessToken });

    return accessToken;
  } catch (error) {
    console.log(`Error`, error);
  }
};
