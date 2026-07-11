import { useEffect, useState } from "react";
import { useAuth } from "../auth/useAuth";
import {
  FetchProfileState,
  GetStringDataAsync,
} from "../storage/ProfileDataAsync";
import { getTokens } from "../storage/SecureTokens";
import AuthenticatedNavigation from "./AuthenticatedNavigation";
import ProfileScreenNavigation from "./ProfileScreenNavigation";
import UnauthenticatedNavigation from "./UnauthenticatedNavigation";
import Splash from "@/src/screens/initials/SplashScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StackNavigation = () => {
  const { token, isLoading } = useAuth();
  const [profileCompleted, setProfileCompleted] = useState<
    string | boolean | null
  >(null);

  useEffect(() => {
    const load = async () => {
      const state = await AsyncStorage.getItem("profilestatus");
      setProfileCompleted(state === "completed");
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
