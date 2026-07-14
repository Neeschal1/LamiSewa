import { API } from "@/src/constants/apiEndpoints";
import api from "../api";

const FetchUsersDetail = async () => {
  const res = await api.get(API.PROFILE.USERPROFILE);
  return res.data;
};

export default FetchUsersDetail;
