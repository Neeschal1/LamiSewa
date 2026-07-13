import { API } from "@/src/constants/apiEndpoints";
import api from "../api";
import axios from "axios";

const UserCareerService = async (email: string, name: string) => {
  try {
    const createUserProfile: any = {
      highest_qualification: email,
      college_name: name,
      working_as: name,
      occupation: name,
      company_or_organization_name: name,
    };
    const res = await api.post(API.PROFILE.CAREERINFO, createUserProfile);
    return res;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const errormessage = err?.response?.data;
      const errorstatus = err?.response?.status;
      return {
        error: errormessage,
        status: errorstatus,
      };
    }
  }
};

export default UserCareerService;