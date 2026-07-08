import { API } from "@/src/constants/apiEndpoints";
import api from "../api";
import { saveTokens } from "@/src/storage/Tokens";

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
  await saveTokens(res.data.Message.Tokens.accesstoken);
  console.log("\n\nData: ", res.data)
  console.log("\n\nStatus: ", res.status)
  return {
    status: res.status,
    accessToken: res.data.Message.Tokens.accesstoken,
  };
};

export default HandleSignupService;
