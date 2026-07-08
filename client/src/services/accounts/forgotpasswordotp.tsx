import { API } from "@/src/constants/apiEndpoints";
import api from "../api";

const HandleForgotPasswordOTPVerification = async (userid: number, codedata: string) => {
  const credentialsData: any = {
    id: userid,
    code: codedata
  };
  const res = await api.post(API.ACCOUNTS.VERIFYACCOUNT, credentialsData);
  console.log(res.data);
  return res
};

export default HandleForgotPasswordOTPVerification;
