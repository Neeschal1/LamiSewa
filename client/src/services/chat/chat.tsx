import { API } from "@/src/constants/apiEndpoints";
import api from "../api";

export const fetchConversations = async () => {
  const res = await api.get(API.CHAT.CONVERSATIONS);
  return res.data?.data ?? [];
};

export const createThread = async (user_id: number) => {
  const res = await api.post(API.CHAT.CONVERSATIONS, { user_id });
  return res.data?.data;
};

export const fetchMessages = async (thread: number) => {
  const res = await api.get(API.CHAT.MESSAGES, { params: { thread } });
  return res.data?.data ?? [];
};

export const sendMessage = async (thread: number, text: string) => {
  const res = await api.post(API.CHAT.MESSAGES, { thread, text });
  return res.data?.data;
};

export const wsUrl = (thread: number, token: string) => {
  const base = (process.env.EXPO_PUBLIC_DJANGO_DEVELOPMENT_SERVER_URL ?? "").replace(/^http/, "ws");
  return `${base}/ws/chat/${thread}/?token=${encodeURIComponent(token)}`;
};
