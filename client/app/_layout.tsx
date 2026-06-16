import { Stack } from "expo-router";
import "../global.css"
import Fonts from "../src/utils/fonts";
import { useFonts } from "expo-font";
import StackNavigation from '../src/constants/Navigation'
import { AuthProvider } from "@/src/auth/AuthProvider";

export default function RootLayout() {
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