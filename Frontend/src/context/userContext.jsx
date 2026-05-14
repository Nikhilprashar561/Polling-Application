import { createContext, useContext, useState } from "react";

const userContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const register = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <userContext.Provider value={{ user, login, register, logout }}>
      {children}
    </userContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthProvider);
};
