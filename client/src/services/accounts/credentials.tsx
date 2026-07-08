import { API } from "@/src/constants/apiEndpoints";
import api from "../api";
import { saveTokens } from "@/src/storage/Tokens";
import axios from "axios";

const HandleAccountCredentials = async (
  name: string,
  username: string,
  email: string,
) => {
  try {
    const credentialsData: any = {
      fullname: name,
      username: username,
      email: email,
    };
    const res = await api.post(
      API.ACCOUNTS.ACCOUNTCREDENTIALS,
      credentialsData,
    );
    console.log(res.data);
    return res.status
  } catch (e) {
    if (axios.isAxiosError(e)) {
      console.log("\n\nStatus code: ", e.response?.status)
      if (e.response?.status === 400){
        return 400;
      } 
      if (e.response?.status === 409) {
        return 409;
      }
    }
  }
  return 500;
};

export default HandleAccountCredentials;
