import { createContext, useContext, useState } from "react";

const pollContext = createContext();

export const PollContextProvider = ({ children }) => {
  const [poll, setPoll] = useState([]);

  const createPoll = (pollData) => {
    setPoll((prev) => [...prev, pollData]);
  };

  const deletePoll = (pollId) => {
    setPoll((prev) => {
      prev.filter((poll) => poll.id !== pollId);
    });
  };

  return (
    <pollContext.Provider value={{ poll, createPoll, deletePoll }}>
      {children}
    </pollContext.Provider>
  );
};

export const usePoll = () => {
  return useContext(pollContext);
};
