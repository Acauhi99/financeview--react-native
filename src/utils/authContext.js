import React, { createContext, useState, useContext } from "react";
import axios from "axios";
import { login as loginService } from "../services/auth";

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const data = await loginService(email, password);

      if (data && data.token && typeof data.token === "string") {
        setToken(data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      } else {
        throw new Error("Token inválido ou não fornecido pela API");
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
