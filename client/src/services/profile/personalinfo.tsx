import { API } from "@/src/constants/apiEndpoints";
import api from "../api";
import { getJsonData } from "@/src/storage/SecureCredentials";

const UserPersonalService = async (profile: number) => {
  const fetchuserspersonalinfodata = await getJsonData("personalinfo");
  console.log("User's personal data: ", fetchuserspersonalinfodata);
  const usersPersonalInfo: any = {
    userprofileid: profile,
    maritalstatus: fetchuserspersonalinfodata["maritalStatus"],
    gotra: fetchuserspersonalinfodata["gotra"],
    current_living_country: fetchuserspersonalinfodata["livingCountry"],
    current_city: fetchuserspersonalinfodata["district"],
    residency_status: fetchuserspersonalinfodata["residencyStatus"],
  };
  const res = await api.post(API.PROFILE.PERSONALINFO, usersPersonalInfo);
  return res;
};

export default UserPersonalService;
