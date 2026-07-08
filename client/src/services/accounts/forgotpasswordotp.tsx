import { API } from "@/src/constants/apiEndpoints";
import api from "../api";

const HandleForgotPasswordOTPVerification = async (email: string, otpdata: string) => {
  const credentialsData: any = {
    otp: otpdata,
    email: email
  };
  const res = await api.post(API.ACCOUNTS.OTPVERIFICATION, credentialsData);
  console.log(res.data);
  return res
};

export default HandleForgotPasswordOTPVerification;
