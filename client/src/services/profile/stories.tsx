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
