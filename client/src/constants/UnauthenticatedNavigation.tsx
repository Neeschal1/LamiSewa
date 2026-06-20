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
import { Title } from "../components/Texts";

const Stack = createNativeStackNavigator<RootStackParamList>();

const UnauthenticatedNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="PersonalInfo" screenOptions={{ headerShown: false }} >
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Login" component={Login} />

      {/* For testing */}
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={optionsScreens} />
      <Stack.Screen name="OtpVerification" component={OtpVerification} options={optionsScreens} />
      <Stack.Screen name="Password" component={Password} options={optionsScreens} />
      <Stack.Screen name="SetNewPassword" component={SetNewPassword} options={optionsScreens} />
      <Stack.Screen name="SignupVerification" component={SignupVerification} options={optionsScreens} />
      <Stack.Screen name="BasicInfo" component={BasicInfo} options={ProfileScreens("Basic Info(1/5)")} />
      <Stack.Screen name="AdditionalInfo" component={AdditionalInfo} options={ProfileScreens("Additional Info(3/5)")} />
      <Stack.Screen name="CareerInfo" component={CareerInfo} options={ProfileScreens("Career Info(4/5)")} />
      <Stack.Screen name="HobbiesInfo" component={HobbiesInfo} options={ProfileScreens("Hobbies Info(5/5)")} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfo} options={ProfileScreens("Personal Info(2/5)")} />
      <Stack.Screen name="Chats" component={Chats} options={optionsScreens} />
      <Stack.Screen name="Home" component={Home} options={optionsScreens} />
      <Stack.Screen name="Notification" component={Notification} options={optionsScreens} />
      <Stack.Screen name="Profile" component={Profile} options={optionsScreens} />
      <Stack.Screen name="Search" component={Search} options={optionsScreens} />

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

const ProfileScreens = (title: string) => ({
  headerShown: true,
  headerTransparent: false,
  headerStyle: {backgroundColor: "#F6F5FF", width: '100%', alignItems: 'center', justifyContent: 'center', flex: 1},
  headerTitle: () => <Title text={title} />,
  headerTintColor: "#000000",
});

