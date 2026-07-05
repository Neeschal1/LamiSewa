import { API } from "@/src/constants/apiEndpoints";
import api from "../api";
import { saveTokens } from "@/src/storage/Tokens";

const HandleAccountCredentials = async (name: string, username: string, email: string) => {
  const credentialsData: any = {
    fullname: name,
    username: username,
    email: email
  };
  const res = await api.post(API.ACCOUNTS.ACCOUNTCREDENTIALS, credentialsData);
  console.log(res.data);
  await saveTokens(res.data.Tokens.accesstoken);
  return res.data.Tokens.accesstoken;
};

export default HandleAccountCredentials;
