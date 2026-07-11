import { API } from "@/src/constants/apiEndpoints";
import api from "../api";
import { saveTokens } from "@/src/storage/SecureTokens";

const HandleSignupService = async (
  name: string,
  email: string,
  user: string,
  password: string,
) => {
  const signupData: any = {
    first_name: name,
    username: user,
    email: email,
    password: password,
  };
  const res = await api.post(API.ACCOUNTS.SIGNUP, signupData);
  return res
};

export default HandleSignupService;
