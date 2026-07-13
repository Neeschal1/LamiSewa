import { API } from "@/src/constants/apiEndpoints";
import api from "../api";

const UserPersonalService = async (
  maritalStatus: string,
  gotra: string,
  currentlivingcountry: string,
  currentcity: string,
  residencystatus: string,
) => {
  const usersPersonalInfo = {
    maritalstatus: maritalStatus,
    gotra: gotra,
    current_living_country: currentlivingcountry,
    current_city: currentcity,
    residency_status: residencystatus,
  };
  const res = await api.post(API.PROFILE.PERSONALINFO, usersPersonalInfo);
  return res;
};

export default UserPersonalService;
