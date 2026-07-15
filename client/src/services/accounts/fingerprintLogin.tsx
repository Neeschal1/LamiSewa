import { API } from "@/src/constants/apiEndpoints";
import api from "../api";
import { saveRefreshTokens, saveTokens } from "@/src/storage/SecureTokens";
import { useAuth } from "@/src/auth/AuthContext";

const HandleFingerPrintLoginVerification = async (useremail: string | any) => {
  const credentialsData: any = {
    email: useremail,
  };
  const res = await api.post(
    API.ACCOUNTS.FINGERPRINTSCANNERLOGIN,
    credentialsData,
  );
  await saveRefreshTokens(res["data"]["Tokens"]["refreshtoken"]);
  return res;
};

export default HandleFingerPrintLoginVerification;
