import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  BasicInfo,
  AdditionalInfo,
  CareerInfo,
  HobbiesInfo,
  PersonalInfo,
  CasualInfo,
  UserInfo,
} from "@/src/screens/profile/profileScreenLayout";
import { RootStackParamList } from "../components/componentsType";
import { View } from "react-native";
import { Title } from "../components/Texts";
import { useEffect, useState } from "react";
import {
  DeleteStringDataAsync,
  GetStringDataAsync,
} from "../storage/ProfileDataAsync";

const Stack = createNativeStackNavigator<RootStackParamList>();

const ProfileScreenNavigation = () => {
  const [startScreen, setStartScreen] =useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    const initialScreen = async () => {
      const screenName = await GetStringDataAsync("UserProfileStatus");
      if (screenName === "BasicInfoCompleted") {
        await DeleteStringDataAsync("UserProfileStatus");
        setStartScreen("PersonalInfo");
        return;
      } else if (screenName === "UserInfoCompleted") {
        await DeleteStringDataAsync("UserProfileStatus");
        setStartScreen("BasicInfo");
        return;
      } 
      else {
        setStartScreen("UserInfo");
      }
    };
    initialScreen();
  }, []);

  if (!startScreen) {
    return null;
  }

  return (
    <Stack.Navigator 
    // initialRouteName="BasicInfo" 
    initialRouteName={startScreen} 
    screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserInfo" component={UserInfo} options={ProfileScreens("User Info(1/7)")} />
      <Stack.Screen name="BasicInfo" component={BasicInfo} options={ProfileScreens("Basic Info(2/7)")} />
      <Stack.Screen name="CasualInfo" component={CasualInfo} options={ProfileScreens("Casual Info(3/7)")} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfo} options={ProfileScreens("Personal Info(4/7)")} />
      <Stack.Screen name="AdditionalInfo" component={AdditionalInfo} options={ProfileScreens("Additional Info(5/7)")} />
      <Stack.Screen name="CareerInfo" component={CareerInfo} options={ProfileScreens("Career Info(6/7)")} />
      <Stack.Screen name="HobbiesInfo" component={HobbiesInfo} options={ProfileScreens("Hobbies Info(7/7)")} />
    </Stack.Navigator>
  );
};

export default ProfileScreenNavigation;

const ProfileScreens = (title: string) => ({
  headerShown: true,
  headerBackVisible: true,
  gestureEnabled: false,
  headerTransparent: true,
  headerStyle: {
    backgroundColor: "#F6F5FF",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  headerTitle: () => <Title text={title} />,
  headerTitleAlign: "center" as const,
});
