import { API } from "@/src/constants/apiEndpoints";
import api from "../api";

const UserHobbiesService = async (email: string, name: string) => {
  const createUserProfile: any = {
    useremail: email,
    username: name,
  };
  const res = await api.post(API.PROFILE.USERPROFILE, createUserProfile);
  return res;
};

export default UserHobbiesService;
