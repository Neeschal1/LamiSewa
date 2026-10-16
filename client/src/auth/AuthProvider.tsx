import React, { createContext, useEffect, useState } from "react";
import {
  clearToken,
  getAccessTokens,
  getRefreshTokens,
  saveAuthTokens,
} from "../storage/SecureTokens";
import { AuthContext } from "./AuthContext";
import {
  GetStringDataAsync,
  StoreStringDataAsync,
  DeleteStringDataAsync,
} from "../storage/ProfileDataAsync";
import { refreshAccessToken as rotateToken } from "../services/api";
import { clearCachedProfile } from "../profile/ProfileProvider";
import { clearCachedMatches } from "../services/matches/matchCache";
import { jwtDecode } from "jwt-decode";

const isExpired = (token: string): boolean => {
  try {
    const payload = jwtDecode<{ exp?: number }>(token);
    if (!payload.exp) return false;
    return payload.exp * 1000 <= Date.now() + 15000;
  } catch {
    return true;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileCompleted, setProfileCompleted] = useState(false);

  useEffect(() => {
    loadingTokens();
  }, []);

  const readProfileFlag = async (): Promise<boolean> => {
    const state = await GetStringDataAsync("ProfileScreenStatus");
    return state === "AllCompleted";
  };

  const loadingTokens = async () => {
    try {
      let storedToken = await getAccessTokens();
      if (storedToken && isExpired(storedToken)) {
        storedToken = await rotateToken();
      }
      if (!storedToken) {
        const refresh = await getRefreshTokens();
        if (refresh) storedToken = await rotateToken();
      }
      setToken(storedToken);
      setProfileCompleted(storedToken ? await readProfileFlag() : false);
    } catch {
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    accessToken: string,
    refreshToken: string | null = null,
    hasProfile: boolean | null = null
  ) => {
    const storedRefresh =
      refreshToken ?? (await getRefreshTokens()) ?? "";
    await saveAuthTokens(accessToken, storedRefresh);
    setToken(accessToken);
    if (hasProfile === true) {
      await StoreStringDataAsync("ProfileScreenStatus", "AllCompleted");
      setProfileCompleted(true);
    } else if (hasProfile === false) {
      await DeleteStringDataAsync("ProfileScreenStatus");
      setProfileCompleted(false);
    } else {
      setProfileCompleted(await readProfileFlag());
    }
  };

  const refreshAccessToken = async (): Promise<string | null> => {
    const next = await rotateToken();
    setToken(next);
    return next;
  };

  const logout = async () => {
    try {
      const refresh = await getRefreshTokens();
      if (refresh) {
        const { default: api } = await import("../services/api");
        await api
          .post("/api/token/blacklist/", { refresh })
          .catch(() => null);
      }
    } catch {
    } finally {
      await clearToken();
      clearCachedProfile();
      clearCachedMatches();
      setToken(null);
      setProfileCompleted(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isLoading,
        profileCompleted,
        setProfileCompleted,
        login,
        refreshAccessToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
