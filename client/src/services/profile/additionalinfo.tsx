import { API } from "@/src/constants/apiEndpoints";
import api from "../api";

const UserAdditionalService = async (height: string, weight: string, religion: string, diet: string, community: string) => {
  const usersAdditionalInfo = {
    height: height,
    weight: weight,
    religion: religion,
    diet: diet,
    community: community,
  };
  const res = await api.post(API.PROFILE.ADDITIONALINFO, usersAdditionalInfo);
  return res;
};

export default UserAdditionalService;
