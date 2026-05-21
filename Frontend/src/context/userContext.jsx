import { createContext, useContext, useState, useEffect } from "react";
import { tokenStore } from "../utils/tokenStore";

const userContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => tokenStore.getUser());

  const login = (userData, accessToken) => {
    tokenStore.setAccessToken(accessToken);
    tokenStore.setUserDerails(userData);
    setUser(userData);
  };

  const register = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    tokenStore.clear();
    setUser(null);
  };

  return (
    <userContext.Provider value={{ user, login, register, logout }}>
      {children}
    </userContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(userContext);
};
