import { API } from "@/src/constants/apiEndpoints";
import api from "../api";

const CreateUsersFeaturedPhoto = async (images: Record<string, string>) => {
    console.log("From the services itself: Images: ", images)
  const res = await api.post(API.PROFILE.FEATUREDPHOTOLIST, images);
  return res;
};

export default CreateUsersFeaturedPhoto;
