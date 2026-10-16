import { API } from "@/src/constants/apiEndpoints";
import api from "../api";

export type ProfileUpdatePayload = {
  username?: string;
  basic_info?: Record<string, string>;
  personal_info?: Record<string, string>;
  additional_info?: Record<string, string>;
  career_info?: Record<string, string>;
};

export const updateOwnProfile = async (payload: ProfileUpdatePayload) => {
  const res = await api.put(API.PROFILE.ME, payload);
  return res.data?.data;
};

export const fetchMemberProfile = async (profileid: string) => {
  const res = await api.get(`${API.PROFILE.MEMBER}${profileid}/`);
  return res.data?.data;
};
