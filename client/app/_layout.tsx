import "../global.css";
import Fonts from "../src/utils/fonts";
import { useFonts } from "expo-font";
import StackNavigation from "../src/constants/Navigation";
import { AuthProvider } from "@/src/auth/AuthProvider";
import { ProfileProvider } from "@/src/profile/ProfileProvider";
import { useEffect } from "react";
import { AppState, Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar";

const hideSystemBar = async () => {
  if (Platform.OS !== "android") return;
  try {
    const modern = NavigationBar as unknown as {
      setHidden?: (hidden: boolean) => void;
      setVisibilityAsync?: (v: "visible" | "hidden") => Promise<void>;
      setBehaviorAsync?: (b: string) => Promise<void>;
    };
    if (typeof modern.setHidden === "function") {
      modern.setHidden(true);
    } else if (typeof modern.setVisibilityAsync === "function") {
      await modern.setVisibilityAsync("hidden");
    }
    if (typeof modern.setBehaviorAsync === "function") {
      await modern.setBehaviorAsync("overlay-swipe");
    }
  } catch {}
};

export default function RootLayout() {
  useEffect(() => {
    hideSystemBar();
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") hideSystemBar();
    });
    return () => sub.remove();
  }, []);

  const [fontsLoaded] = useFonts(Fonts);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ProfileProvider>
        <StackNavigation />
      </ProfileProvider>
    </AuthProvider>
  );
}
