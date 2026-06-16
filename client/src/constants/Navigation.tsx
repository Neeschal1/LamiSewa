import { useAuth } from "../auth/useAuth";
import { getTokens } from "../storage/Tokens";
import AuthenticatedNavigation from "./AuthenticatedNavigation";
import UnauthenticatedNavigation from "./UnauthenticatedNavigation";
import Splash from "@/src/screens/initials/SplashScreen";

const StackNavigation = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <Splash />;
  }

  if (!token){
    return (<UnauthenticatedNavigation />)
  }
  
  return <AuthenticatedNavigation />
};

export default StackNavigation;
