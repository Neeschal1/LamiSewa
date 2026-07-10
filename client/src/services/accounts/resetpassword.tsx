import { API } from "@/src/constants/apiEndpoints";
import api from "../api";

const HandleResetPasswordService = async (userid: number, password: string) => {
  const resetPasswordData: any = {
    userid: userid,
    password: password
  };
  const res = await api.post(API.ACCOUNTS.RESETPASSWORD, resetPasswordData);
  console.log("Response Data: ", res.data);
  return res
};

export default HandleResetPasswordService;
