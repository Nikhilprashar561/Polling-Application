import { io } from "socket.io-client";
import { baseURL } from "../common/SummaryApi";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(baseURL, {
      withCredentials: true,
      autoConnect: false,
    });
  }
  return socket;
};

export const connectSocket = () => {
  const s = getSocket();
  if (!s.connected) s.connect();
  return s;
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
};

export const joinPollRoom = (pollId) => {
  const s = connectSocket();
  s.emit("join_poll", pollId);
};

export const leavePollRoom = (pollId) => {
  const s = getSocket();
  if (s) s.emit("leave_poll", pollId);
};

export const onVoteUpdate = (callback) => {
  const s = connectSocket();
  s.on("vote_update", callback);
  return () => s.off("vote_update", callback);
};
