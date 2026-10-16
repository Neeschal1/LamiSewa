import { API } from "@/src/constants/apiEndpoints";
import api from "../api";

export const fetchNotifications = async () => {
  const res = await api.get(API.NOTIFICATIONS.LIST);
  return res.data?.data ?? [];
};

export const markNotificationRead = async (id: number) => {
  const res = await api.patch(`${API.NOTIFICATIONS.LIST}${id}/`, {});
  return res.data?.data;
};

export const markAllNotificationsRead = async () => {
  const res = await api.post(`${API.NOTIFICATIONS.LIST}read-all/`, {});
  return res.data;
};
