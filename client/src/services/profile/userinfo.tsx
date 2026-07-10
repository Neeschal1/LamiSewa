import { API } from "@/src/constants/apiEndpoints";
import api from "../api";

const UserProfileService = async (id: string | undefined | null, name: string) => {
  const createUserProfile: any = {
    userid: id,
    username: name,
  };
  const res = await api.post(API.PROFILE.USERPROFILE, createUserProfile);
  return res;
};

export default UserProfileService;
