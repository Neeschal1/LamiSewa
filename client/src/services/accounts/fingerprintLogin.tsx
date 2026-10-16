import { API } from "@/src/constants/apiEndpoints";
import api from "../api";

const HandleFingerPrintLoginVerification = async (useremail: string | null) => {
  if (!useremail) {
    throw { response: { status: 400, data: { Message: "No saved account for biometric login." } } };
  }
  const res = await api.post(API.ACCOUNTS.FINGERPRINTSCANNERLOGIN, {
    email: useremail.trim().toLowerCase(),
  });
  const access = res.data?.Tokens?.accesstoken;
  const refresh = res.data?.Tokens?.refreshtoken;
  if (!access || !refresh) {
    throw { response: { status: 401, data: { Message: "Biometric login failed." } } };
  }
  return {
    accessToken: access,
    refreshToken: refresh,
    hasProfile: res.data?.UserprofileStatus === true,
  };
};

export default HandleFingerPrintLoginVerification;
