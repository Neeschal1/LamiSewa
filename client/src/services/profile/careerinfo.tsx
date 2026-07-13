import { API } from "@/src/constants/apiEndpoints";
import api from "../api";

const UserCareerService = async (
  highestqualification: string,
  collegename: string,
  workingas: string,
  profession: string,
  companyname: string,
) => {
  const userCareerInfo = {
    highest_qualification: highestqualification,
    college_name: collegename,
    working_as: workingas,
    occupation: profession,
    company_or_organization_name: companyname,
  };
  const res = await api.post(API.PROFILE.CAREERINFO, userCareerInfo);
  return res;
};

export default UserCareerService;
