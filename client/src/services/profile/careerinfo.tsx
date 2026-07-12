import { API } from "@/src/constants/apiEndpoints";
import api from "../api";

const UserCareerService = async (email: string, name: string) => {
  const createUserProfile: any = {
    highest_qualification: email,
    college_name: name,
    working_as: name,
    occupation: name,
    company_or_organization_name: name,
  };
  const res = await api.post(API.PROFILE.USERPROFILE, createUserProfile);
  return res;
};

export default UserCareerService;
