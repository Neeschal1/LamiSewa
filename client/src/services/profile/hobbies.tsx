import { API } from "@/src/constants/apiEndpoints";
import api from "../api";
import axios from "axios";

const UserHobbiesService = async (
  hobby1: string,
  hobby2: string,
  hobby3: string,
  hobby4: string,
  hobby5: string,
) => {
  try {
    const createUserHobbyProfile: any = {
      hobby1: hobby1,
      hobby2: hobby2,
      hobby3: hobby3,
      hobby4: hobby4,
      hobby5: hobby5,
    };
    const res = await api.post(API.PROFILE.HOBBIESLIST, createUserHobbyProfile);
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

export default UserHobbiesService;
