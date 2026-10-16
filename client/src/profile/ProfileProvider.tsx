import React, { createContext, useContext, useCallback, useState } from "react";
import FetchUsersDetail from "../services/settings/fetchDetails";

type ProfileContextType = {
  data: any | null;
  loading: boolean;
  fetchProfile: (force?: boolean) => Promise<any | null>;
  refreshProfile: () => Promise<any | null>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

let cachedProfile: any | null = null;
let inFlight: Promise<any | null> | null = null;

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<any | null>(cachedProfile);
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async (force = false) => {
    if (!force && cachedProfile) {
      setData(cachedProfile);
      return cachedProfile;
    }
    if (inFlight && !force) return inFlight;
    setLoading(true);
    inFlight = (async () => {
      try {
        const res = await FetchUsersDetail();
        cachedProfile = res;
        setData(res);
        return res;
      } catch {
        return cachedProfile;
      } finally {
        setLoading(false);
        inFlight = null;
      }
    })();
    return inFlight;
  }, []);

  return (
    <ProfileContext.Provider value={{ data, loading, fetchProfile, refreshProfile: () => fetchProfile(true) }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");
  return ctx;
};

export const clearCachedProfile = () => {
  cachedProfile = null;
};
