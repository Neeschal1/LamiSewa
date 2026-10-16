import { API } from "@/src/constants/apiEndpoints";
import api from "../api";

export const followUser = async (profileid: string) => {
  const res = await api.post(API.PRIVACY.FOLLOW, { profileid });
  return res.data;
};

export const unfollowUser = async (profileid: string) => {
  const res = await api.delete(`${API.PRIVACY.FOLLOW}${profileid}/`);
  return res.data;
};

export const fetchFollowers = async () => {
  const res = await api.get(API.PRIVACY.FOLLOWERS);
  return res.data?.data ?? [];
};

export const fetchFollowing = async () => {
  const res = await api.get(API.PRIVACY.FOLLOWING);
  return res.data?.data ?? [];
};

export const fetchMutual = async () => {
  const res = await api.get(API.PRIVACY.MUTUAL);
  return res.data?.data ?? [];
};
