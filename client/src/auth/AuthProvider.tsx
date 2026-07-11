import React, { createContext, useEffect, useState } from "react";
import { clearToken, getTokens, saveTokens } from "../storage/SecureTokens";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadingTokens();
  }, []);

  const loadingTokens = async () => {
    try {
      const storedToken = await getTokens();
      setToken(storedToken);
    } catch (error) {
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (newToken: string) => {
    await saveTokens(newToken);
    setToken(newToken);
  };

  const logout = async () => {
    await clearToken();
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
