import { API } from "@/src/constants/apiEndpoints";
import api from "../api";
import { saveTokens } from "@/src/storage/SecureTokens";
import Records from "../payments/Records";

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
  console.log("Reached before Records.")
  await Records()
  console.log("Reached after Records.")
  return res
};

export default HandleSignupService;
