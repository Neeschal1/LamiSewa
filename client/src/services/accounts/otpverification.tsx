import { API } from "@/src/constants/apiEndpoints";
import api from "../api";

const HandleOTPVerification = async (email: string, otpdata: string) => {
  const credentialsData: any = {
    otp: otpdata,
    email: email
  };
  const res = await api.post(API.ACCOUNTS.OTPVERIFICATION, credentialsData);
  console.log(res.data);
  return res
};

export default HandleOTPVerification;
