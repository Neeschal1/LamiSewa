import { API } from "@/src/constants/apiEndpoints";
import api from "../api";
import { saveTokens } from "@/src/storage/SecureTokens";
import axios from "axios";

const HandleAccountCredentials = async (
  name: string,
  phone: string,
  email: string,
) => {
  console.log("Reached here!!!");
  try {
    const credentialsData: any = {
      fullname: name,
      contactnumber: phone,
      email: email,
    };
    const res = await api.post(
      API.ACCOUNTS.ACCOUNTCREDENTIALS,
      credentialsData,
    );
    console.log("ResponseData: ", res.data);
    return res.status;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      console.log("\n\nStatus code: ", e.response?.status);
      console.log("\n\Issue data: ", e.response?.data);

      if (e.response?.status === 400) {
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
