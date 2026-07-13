import { API } from "@/src/constants/apiEndpoints";
import api from "../api";

const UserHobbiesService = async (
  hobby1: string,
  hobby2: string,
  hobby3: string,
  hobby4: string,
  hobby5: string,
) => {
  const usersHobbiesInfo: any = {
    hobby1: hobby1,
    hobby2: hobby2,
    hobby3: hobby3,
    hobby4: hobby4,
    hobby5: hobby5,
  };
  const res = await api.post(API.PROFILE.HOBBIESLIST, usersHobbiesInfo);
  console.log("Response from server: ", res.data)
  return res;
};

export default UserHobbiesService;
