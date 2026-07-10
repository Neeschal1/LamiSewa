import "../global.css"
import Fonts from "../src/utils/fonts";
import { useFonts } from "expo-font";
import StackNavigation from '../src/constants/Navigation'
import { AuthProvider } from "@/src/auth/AuthProvider";
import { useEffect } from "react";
import { AppState } from "react-native"
import * as NavigationBar from "expo-navigation-bar";

export default function RootLayout() {

   useEffect(() => {
  const hideBar = async () => {
    try {
      await NavigationBar.setVisibilityAsync("hidden");
    } catch {}
  };

  hideBar();

  const sub = AppState.addEventListener("change", state => {
    if (state === "active") {
      hideBar();
    }
  });

  return () => sub.remove();
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