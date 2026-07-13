import { useEffect, useState } from "react";
import { useAuth } from "../auth/useAuth";
import AuthenticatedNavigation from "./AuthenticatedNavigation";
import ProfileScreenNavigation from "./ProfileScreenNavigation";
import UnauthenticatedNavigation from "./UnauthenticatedNavigation";
import Splash from "@/src/screens/initials/SplashScreen";
import { DeleteStringDataAsync, GetStringDataAsync } from "../storage/ProfileDataAsync";

const StackNavigation = () => {
  const { token, isLoading } = useAuth();
  const [profileCompleted, setProfileCompleted] = useState<string | boolean | null>(null);

  useEffect(() => {
    const load = async () => {
      const state = await GetStringDataAsync("ProfileScreenStatus");
      console.log("ProfileScreenStatus:", state);
      // await DeleteStringDataAsync("ProfileScreenStatus")
      setProfileCompleted(state === "AllCompleted");
    };

    if (token) {
      load();
    }
  }, [token]);

  if (isLoading) {
    return <Splash />;
  }

  if (!token) {
    return <UnauthenticatedNavigation />;
  }

  if (!profileCompleted) {
    return <ProfileScreenNavigation />;
  }

  return <AuthenticatedNavigation />;
};

export default StackNavigation;
