import { Text, View } from "react-native";
import "../global.css";
import {
  MainScreenName,
  Title,
  SubTitle,
  Description,
} from "@/src/components/systemComponentsLayout";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <MainScreenName text="Login" />
      <Title text="Login" />
      <SubTitle text="Login" />
      <Description text="Login" />
    </View>
  );
}
