import { API } from "@/src/constants/apiEndpoints";
import api from "../api";

export type ProfileFilters = {
  q?: string;
  gender?: string;
  city?: string;
  country?: string;
  maritalstatus?: string;
  religion?: string;
  occupation?: string;
};

export const searchProfiles = async (filters: ProfileFilters) => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v && String(v).trim() !== "")
  );
  const res = await api.get(API.PROFILE.SEARCH, { params });
  return res.data?.data ?? [];
};
