import AsyncStorage from "@react-native-async-storage/async-storage";

export const PROFILE_DRAFT_KEY = "ProfileDraft";

export type ProfileDraft = {
  username?: string;
  visible_to_verified_only?: boolean;
  basic_info?: Record<string, any>;
  personal_info?: Record<string, any>;
  additional_info?: Record<string, any>;
  career_info?: Record<string, any>;
  hobbies?: Record<string, any>;
};

export const saveDraftSection = async (section: keyof ProfileDraft, value: any) => {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_DRAFT_KEY);
    const draft: ProfileDraft = raw ? JSON.parse(raw) : {};
    draft[section] = value;
    await AsyncStorage.setItem(PROFILE_DRAFT_KEY, JSON.stringify(draft));
  } catch (err) {
    console.log("Draft save error:", err);
  }
};

export const getDraft = async (): Promise<ProfileDraft> => {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_DRAFT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.log("Draft read error:", err);
    return {};
  }
};

export const clearDraft = async () => {
  try {
    await AsyncStorage.removeItem(PROFILE_DRAFT_KEY);
  } catch (err) {
    console.log("Draft clear error:", err);
  }
};
