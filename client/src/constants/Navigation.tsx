import { useEffect } from "react";
import { useAuth } from "../auth/useAuth";
import AuthenticatedNavigation from "./AuthenticatedNavigation";
import ProfileScreenNavigation from "./ProfileScreenNavigation";
import UnauthenticatedNavigation from "./UnauthenticatedNavigation";
import Splash from "@/src/screens/initials/SplashScreen";

const StackNavigation = () => {
  const { token, isLoading, profileCompleted } = useAuth();


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
