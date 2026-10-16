import axios from "axios";
import {
  getAccessTokens,
  getRefreshTokens,
  saveAuthTokens,
  clearToken,
} from "../storage/SecureTokens";

const api = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_DJANGO_DEVELOPMENT_SERVER_URL}`,
  timeout: 10000,
});

let refreshPromise: Promise<string | null> | null = null;

const rotateAccessToken = async (): Promise<string | null> => {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    try {
      const refresh = await getRefreshTokens();
      if (!refresh) return null;
      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_DJANGO_DEVELOPMENT_SERVER_URL}/api/token/refresh/`,
        { refresh },
        { timeout: 10000 }
      );
      const nextAccess: string | undefined = res.data?.access;
      const nextRefresh: string | undefined = res.data?.refresh;
      if (!nextAccess) return null;
      await saveAuthTokens(nextAccess, nextRefresh ?? refresh);
      return nextAccess;
    } catch {
      await clearToken();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
};

export const refreshAccessToken = () => rotateAccessToken();

api.interceptors.request.use(
  async (config) => {
    const token = await getAccessTokens();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !original.url?.includes("/api/token/refresh/")
    ) {
      original._retry = true;
      const nextAccess = await rotateAccessToken();
      if (nextAccess) {
        original.headers.Authorization = `Bearer ${nextAccess}`;
        return api(original);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
