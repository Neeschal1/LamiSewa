import { useEffect, useState } from "react";
import { useAuth } from "../auth/useAuth";
import AuthenticatedNavigation from "./AuthenticatedNavigation";
import ProfileScreenNavigation from "./ProfileScreenNavigation";
import UnauthenticatedNavigation from "./UnauthenticatedNavigation";
import Splash from "@/src/screens/initials/SplashScreen";
import { DeleteStringDataAsync, GetStringDataAsync } from "../storage/ProfileDataAsync";

const StackNavigation = () => {
  const { token, isLoading, profileCompleted } = useAuth();
  // const [profileCompleted, setProfileCompleted] = useState<boolean>(false);

  // useEffect(() => {
  //   const load = async () => {
  //     const state = await GetStringDataAsync("ProfileScreenStatus");
  //     console.log("ProfileScreenStatus:", state);
  //     console.log("Profile completed?:", profileCompleted);
  //     await DeleteStringDataAsync("ProfileScreenStatus")
  //     // if (state === "AllCompleted"){
  //     //   setProfileCompleted(true);
  //     // } else {
  //     //   setProfileCompleted(false)
  //     // }
  //   };

  //   if (token) {
  //     load();
  //   }
  // }, [token]);

  useEffect(() => {
  console.log("profileCompleted state:", profileCompleted);
}, [profileCompleted]);

  if (isLoading) {
    return <Splash />;
  }

  if (!token) {
    console.log("Rendering UnauthenticatedNavigation");
    return <UnauthenticatedNavigation />;
  }

  if (profileCompleted === false) {
    console.log("Rendering ProfileScreenNavigation");
    return <ProfileScreenNavigation />;
  }

  console.log("Rendering AuthenticatedNavigation");
  return <AuthenticatedNavigation />;

};

export default StackNavigation;
