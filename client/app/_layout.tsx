import "../global.css"
import Fonts from "../src/utils/fonts";
import { useFonts } from "expo-font";
import StackNavigation from '../src/constants/Navigation'
import { AuthProvider } from "@/src/auth/AuthProvider";
import { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";

export default function RootLayout() {

   useEffect(() => {
    const hideNavBar = async () => {
      await NavigationBar.setBehaviorAsync("overlay-swipe");
      await NavigationBar.setVisibilityAsync("hidden");
    };

    hideNavBar();
  }, []);
  
  const [fontsLoaded] = useFonts(Fonts);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <StackNavigation />
    </AuthProvider>
  );
}