import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Welcome,
  Login,
  Signup,
  SignupVerification,
  ForgotPassword,
  Password,
  SetNewPassword,
  OtpVerification,
  Splash,
} from "@/src/screens/initials/initialScreensLayout";
import { RootStackParamList } from "../components/componentsType";
import {
  OnboardingScreen,
} from "@/src/screens/extras/ExtraScreenLayout";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { DeleteStringDataAsync, GetStringDataAsync } from "../storage/ProfileDataAsync";

const Stack = createNativeStackNavigator<RootStackParamList>();

const UnauthenticatedNavigation = () => {
  const [initialScreen, setInitialScreen] = useState<keyof RootStackParamList | null >(null);

  useEffect(() => {
    const OnboardingScreenState = async () => {
      const screenName = await GetStringDataAsync("onboardingState");
      if (screenName === "completed") {
        setInitialScreen("Welcome");
        return;
      } else {
        setInitialScreen("OnboardingScreen");
      }
      await DeleteStringDataAsync("onboardingState")
    };
    OnboardingScreenState();
  }, []);

  if (initialScreen === null) {
    return (<View className="flex-1 justify-center items-center"><ActivityIndicator size="large" /></View>);
  }

  return (
    <Stack.Navigator
      initialRouteName={initialScreen}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen options={{ animation: "fade" }} name="OnboardingScreen" component={OnboardingScreen}/>
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={optionsScreens}/>
      <Stack.Screen name="SetNewPassword" component={SetNewPassword} options={optionsScreens}/>
      <Stack.Screen name="OtpVerification" component={OtpVerification} options={optionsScreens}/>
      <Stack.Screen name="SignupVerification" component={SignupVerification} options={optionsScreens}/>
      <Stack.Screen name="Password" component={Password} options={optionsScreens}/>
    </Stack.Navigator>
  );
};

export default UnauthenticatedNavigation;

const optionsScreens = {
  headerShown: true,
  headerTransparent: true,
  headerTitle: " ",
  headerTintColor: "#000000",
  headerBackVisible: false,
  gestureEnabled: false,
};
