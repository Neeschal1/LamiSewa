import { API } from "@/src/constants/apiEndpoints";
import api from "../api";
import axios from "axios";
import { saveTokens } from "@/src/storage/Tokens";

const HandleLoginService = async (
  email: string,
  password: string,
) => {
  const loginData: any = {
    email: email,
    password: password,
  };
  const res = await api.post(API.ACCOUNTS.LOGIN, loginData);
  await saveTokens(res.data.Tokens.accesstoken);
  return res.data.Tokens.accesstoken;
};

export default HandleLoginService;
