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
  living_in?: string;
  education?: string;
  diet?: string;
  mangalik?: string;
  community?: string;
  age_min?: number;
  age_max?: number;
};

export const searchProfiles = async (filters: ProfileFilters) => {
  const params: Record<string, string | number> = {};
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      params[k] = v as string | number;
    }
  });
  const res = await api.get(API.PROFILE.SEARCH, { params });
  return res.data?.data ?? [];
};

export const fetchRandomMember = async () => {
  const res = await api.get(API.PROFILE.SEARCH, { params: { random: 1 } });
  const data = res.data?.data ?? [];
  return Array.isArray(data) ? data[0] ?? null : data ?? null;
};
