import { API } from "@/src/constants/apiEndpoints";
import api from "../api";

export const changePassword = async (current_password: string, new_password: string) => {
  const res = await api.post(API.ACCOUNTS.CHANGEPASSWORD, {
    current_password,
    new_password,
  });
  return res.data;
};
