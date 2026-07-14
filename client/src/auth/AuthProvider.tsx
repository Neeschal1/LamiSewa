import React, { createContext, useEffect, useState } from "react";
import {
  clearToken,
  getAccessTokens,
  saveTokens,
} from "../storage/SecureTokens";
import { AuthContext } from "./AuthContext";
import { GetStringDataAsync } from "../storage/ProfileDataAsync";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileCompleted, setProfileCompleted] = useState(false);

  useEffect(() => {
    loadingTokens();
  }, []);

  const loadingTokens = async () => {
    try {
      const storedToken = await getAccessTokens();
      setToken(storedToken);
      const state = await GetStringDataAsync("ProfileScreenStatus");
      setProfileCompleted(state === "AllCompleted");
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
    setProfileCompleted(false);
    const state = await GetStringDataAsync("ProfileScreenStatus");
    setProfileCompleted(state === "AllCompleted");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isLoading,
        profileCompleted,
        setProfileCompleted,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
