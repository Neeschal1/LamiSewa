import { API } from "@/src/constants/apiEndpoints";
import api from "../api";

export type FeaturedPhotoItem = {
  id: number;
  image_url: string;
  position: number;
  created_at: string;
};

export const fetchFeaturedPhotos = async (): Promise<FeaturedPhotoItem[]> => {
  const res = await api.get(API.PROFILE.FEATUREDPHOTOS);
  return res.data?.data ?? [];
};

export const saveFeaturedPhotos = async (image_urls: string[]) => {
  const res = await api.post(API.PROFILE.FEATUREDPHOTOS, { image_urls });
  return res.data?.data ?? [];
};

export const deleteFeaturedPhoto = async (id: number) => {
  const res = await api.delete(`${API.PROFILE.FEATUREDPHOTOS}${id}/`);
  return res.data;
};
