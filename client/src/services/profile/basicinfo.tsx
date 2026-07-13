import { API } from "@/src/constants/apiEndpoints";
import api from "../api";

const UserBasicService = async (
  name: string,
  nickName: string,
  usersbio: string,
  profilepic: string,
  coverpic: string,
  profilehandler: string,
  gender: string,
  dob: string,
) => {
  console.log("Vitra samma ta pugyo!")
  const createBasicInfoUsersProfile: any = {
    fullname: name,
    nickname: nickName,
    bio: usersbio,
    profile_picture: profilepic,
    cover_picture: coverpic,
    profile_handler: profilehandler,
    gender: gender,
    date_of_birth: dob,
  };
  const res = await api.post(API.PROFILE.BASICINFO, createBasicInfoUsersProfile);
  console.log("Response from server, basicinfoservices bata: ", res.data)
  return res;
};

export default UserBasicService;
