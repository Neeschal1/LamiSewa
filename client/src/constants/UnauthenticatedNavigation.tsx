import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Splash,
  Welcome,
  Login,
  Signup,

  // For testing
  ForgotPassword,
  OtpVerification,
  Password,
  SetNewPassword,
  SignupVerification,
} from "@/src/screens/initials/initialScreensLayout";

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

const UnauthenticatedNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Login" component={Login} />

      {/* For testing */}
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={optionsScreens}
      />
      <Stack.Screen
        name="OtpVerification"
        component={OtpVerification}
        options={optionsScreens}
      />
      <Stack.Screen
        name="Password"
        component={Password}
        options={optionsScreens}
      />
      <Stack.Screen
        name="SetNewPassword"
        component={SetNewPassword}
        options={optionsScreens}
      />
      <Stack.Screen
        name="SignupVerification"
        component={SignupVerification}
        options={optionsScreens}
      />
      <Stack.Screen
        name="BasicInfo"
        component={BasicInfo}
        options={optionsScreens}
      />
    </Stack.Navigator>
  );
};

export default UnauthenticatedNavigation;

// For testing
const optionsScreens = {
  headerShown: true,
  headerTransparent: true,
  headerTitle: " ",
  headerTintColor: "#000000",
};
