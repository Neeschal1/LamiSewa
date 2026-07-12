import React, { createContext, useEffect, useState } from "react";
import { clearToken, getAccessTokens, saveTokens } from "../storage/SecureTokens";
import { AuthContext } from "./AuthContext";
import { StoreStringDataAsync } from "../storage/ProfileDataAsync";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadingTokens();
  }, []);

  const loadingTokens = async () => {
    try {
      const storedToken = await getAccessTokens();
      setToken(storedToken);
    } catch (error) {
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }; 
 
  const login = async (accessToken: string) => {
    await saveTokens(accessToken);
    setToken(accessToken);
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
