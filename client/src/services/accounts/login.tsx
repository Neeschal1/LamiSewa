import { API } from "@/src/constants/apiEndpoints";
import api from "../api";
import { saveAuthTokens } from "@/src/storage/SecureTokens";
import {
  DeleteStringDataAsync,
  StoreStringDataAsync,
} from "@/src/storage/ProfileDataAsync";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const HandleLoginService = async (email: string, password: string) => {
  const cleanEmail = email.trim().toLowerCase();
  if (!EMAIL_RE.test(cleanEmail)) {
    throw { response: { status: 400, data: { Message: "Enter a valid email address." } } };
  }
  if (!password || password.length < 8) {
    throw { response: { status: 400, data: { Message: "Password must be at least 8 characters." } } };
  }
  const res = await api.post(API.ACCOUNTS.LOGIN, {
    email: cleanEmail,
    password,
  });
  const access = res.data?.Tokens?.accesstoken;
  const refresh = res.data?.Tokens?.refreshtoken;
  if (!access || !refresh) {
    throw { response: { status: 401, data: { Message: "Login failed. Please try again." } } };
  }
  await saveAuthTokens(access, refresh);
  await StoreStringDataAsync("UserEmail", cleanEmail);
  const hasProfile = res.data?.UserprofileStatus === true;
  if (hasProfile) {
    await StoreStringDataAsync("ProfileScreenStatus", "AllCompleted");
  } else {
    await DeleteStringDataAsync("ProfileScreenStatus");
  }
  return { accessToken: access, refreshToken: refresh, hasProfile };
};

export default HandleLoginService;
