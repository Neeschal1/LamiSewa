import { Stack } from "expo-router";
import "../global.css"
import Fonts from "../src/utils/fonts";
import { useFonts } from "expo-font";

export default function RootLayout() {
  const [fontsLoaded] = useFonts(Fonts);

  if (!fontsLoaded) {
    return null;
  }

  return <Stack />;
}