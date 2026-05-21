import { createContext, useContext, useState } from "react";

const pollContext = createContext();

export const PollContextProvider = ({ children }) => {
  const [polls, setPolls] = useState([]);
  const [currentPoll, setCurrentPoll] = useState(null);

  const addPoll = (pollData) => {
    setPolls((prev) => [pollData, ...prev]);
  };

  const setAllPolls = (pollsData) => {
    setPolls(pollsData);
  };

  const removePoll = (pollId) => {
    setPolls((prev) => prev.filter((p) => p.id !== pollId));
  };

  const updatePoll = (pollId, updates) => {
    setPolls((prev) =>
      prev.map((p) => (p.id === pollId ? { ...p, ...updates } : p))
    );
  };

  return (
    <pollContext.Provider
      value={{ polls, currentPoll, setCurrentPoll, addPoll, setAllPolls, removePoll, updatePoll }}
    >
      {children}
    </pollContext.Provider>
  );
};

export const usePoll = () => {
  return useContext(pollContext);
};
