import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  ForgotPassword,
  OtpVerification,
  Password,
  SetNewPassword,
  SignupVerification,
  Splash,
} from "../screens/initials/initialScreensLayout";
// For Testing
import {
  BasicInfo,
  AdditionalInfo,
  CareerInfo,
  LastVerification,
  HobbiesInfo,
  PersonalInfo,
} from "@/src/screens/profile/profileScreenLayout";

// For Testing
import {
  Chats,
  Home,
  Notification,
  Profile,
  Search,
} from "@/src/screens/main/mainScreenLayouts";
import { RootStackParamList } from "@/src/components/componentsType";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthenticatedNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={optionsScreens} />
      <Stack.Screen name="OtpVerification" component={OtpVerification} options={optionsScreens} />
      <Stack.Screen name="Password" component={Password} options={optionsScreens} />
      <Stack.Screen name="SetNewPassword" component={SetNewPassword} options={optionsScreens} />
      <Stack.Screen name="SignupVerification" component={SignupVerification} options={optionsScreens} />
      <Stack.Screen name="BasicInfo" component={BasicInfo} options={optionsScreens} />
      <Stack.Screen name="AdditionalInfo" component={AdditionalInfo} options={optionsScreens} />
      <Stack.Screen name="CareerInfo" component={CareerInfo} options={optionsScreens} />
      <Stack.Screen name="HobbiesInfo" component={HobbiesInfo} options={optionsScreens} />
      <Stack.Screen name="LastVerification" component={LastVerification} options={optionsScreens} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfo} options={optionsScreens} />
      <Stack.Screen name="Chats" component={Chats} options={optionsScreens} />
      <Stack.Screen name="Home" component={Home} options={optionsScreens} />
      <Stack.Screen name="Notification" component={Notification} options={optionsScreens} />
      <Stack.Screen name="Profile" component={Profile} options={optionsScreens} />
      <Stack.Screen name="Search" component={Search} options={optionsScreens} />
    </Stack.Navigator>
  );
};

export default AuthenticatedNavigation;

const optionsScreens = {
  headerShown: true,
  headerTransparent: true,
  headerTitle: " ",
  headerTintColor: "#000000",
};
