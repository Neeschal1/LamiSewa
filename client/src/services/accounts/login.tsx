import { API } from "@/src/constants/apiEndpoints";
import api from "../api";
import { saveRefreshTokens, saveTokens } from "@/src/storage/SecureTokens";
import { DeleteStringDataAsync, GetStringDataAsync, StoreStringDataAsync } from "@/src/storage/ProfileDataAsync";

const HandleLoginService = async (email: string, password: string) => {
  const loginData: any = {
    email: email,
    password: password,
  };
  const res = await api.post(API.ACCOUNTS.LOGIN, loginData);
  console.log(res.data);

  await saveTokens(res["data"]["Tokens"]["accesstoken"]);
  await saveRefreshTokens(res["data"]["Tokens"]["refreshtoken"]);

  const profilescreenstatus = res["data"]["UserprofileStatus"]
  if (profilescreenstatus === true){
    await StoreStringDataAsync("UserInfoScreenStatus", "Completed")
  } else {
    await DeleteStringDataAsync("UserInfoScreenStatus")
  }

  return res.data.Tokens;
};

export default HandleLoginService;
