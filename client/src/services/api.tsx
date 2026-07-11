import axios from "axios";
import { getAccessTokens } from "../storage/SecureTokens";

const api = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_DJANGO_DEVELOPMENT_SERVER_URL}`,
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await getAccessTokens();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
