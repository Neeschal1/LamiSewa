import { API } from "@/src/constants/apiEndpoints";
import api from "../api";

const FindAccountService = async (number: string) => {
  const findAccountData: any = {contactNumber: number};
  const res = await api.post(API.ACCOUNTS.FINDACCOUNT, findAccountData);
  console.log(res.data)
  return res
};

export default FindAccountService;
