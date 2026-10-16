import * as SecureStore from "expo-secure-store";

const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

export const saveTokens = async (access: string) => {
  try {
    await SecureStore.setItemAsync(ACCESS_KEY, access);
  } catch (err) {
    return err;
  }
};

export const saveRefreshTokens = async (refresh: string) => {
  try {
    await SecureStore.setItemAsync(REFRESH_KEY, refresh);
  } catch (err) {
    return err;
  }
};

export const saveAuthTokens = async (access: string, refresh: string) => {
  await saveTokens(access);
  await saveRefreshTokens(refresh);
};

export const clearToken = async () => {
  try {
    await SecureStore.deleteItemAsync(ACCESS_KEY);
    await SecureStore.deleteItemAsync(REFRESH_KEY);
  } catch (err) {
    return `${err}`;
  }
};

export const getAccessTokens = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(ACCESS_KEY);
  } catch {
    return null;
  }
};

export const getRefreshTokens = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(REFRESH_KEY);
  } catch {
    return null;
  }
};
