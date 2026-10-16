import { API } from "@/src/constants/apiEndpoints";
import api from "../api";

export const fetchStories = async () => {
  const res = await api.get(API.PROFILE.STORIES);
  return res.data?.data ?? [];
};

export const uploadStory = async (storyUrl: string) => {
  const res = await api.post(API.PROFILE.STORIES, { story: storyUrl });
  return res.data?.data;
};

export const recordStoryView = async (storyId: number) => {
  const res = await api.post(`${API.PROFILE.STORIES}${storyId}/view/`, {});
  return res.data?.data;
};

export const fetchStoryViewers = async (storyId: number) => {
  const res = await api.get(`${API.PROFILE.STORIES}${storyId}/viewers/`);
  return res.data?.data ?? [];
};
