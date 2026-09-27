import { API } from "@/src/constants/apiEndpoints";
import api from "../api";
import { getDraft } from "@/src/storage/profileDraft";

const SubmitCompleteProfileService = async (hobbies: string[]) => {
  const draft = await getDraft();
  const payload: any = {
    username: draft.username,
    visible_to_verified_only: draft.visible_to_verified_only ?? false,
    basic_info: draft.basic_info,
    personal_info: draft.personal_info,
    additional_info: draft.additional_info,
    career_info: draft.career_info,
    hobbies: {
      hobby1: hobbies[0],
      hobby2: hobbies[1],
      hobby3: hobbies[2],
      hobby4: hobbies[3],
      hobby5: hobbies[4],
    },
  };
  const res = await api.post(API.PROFILE.COMPLETEPROFILE, payload);
  return res;
};

export default SubmitCompleteProfileService;
