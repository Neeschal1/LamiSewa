import { API } from "@/src/constants/apiEndpoints";
import api from "../api";

const HandleResetPasswordService = async (contactNumber: string, password: string) => {
  const resetPasswordData: any = {
    contactNumber: contactNumber,
    password: password,
  };
  const res = await api.post(API.ACCOUNTS.RESETPASSWORD, resetPasswordData);
  return res;
};

export default HandleResetPasswordService;
