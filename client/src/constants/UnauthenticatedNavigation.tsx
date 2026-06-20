import { TouchableOpacity, Text } from 'react-native'
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
  CasualInfo
} from "@/src/screens/profile/profileScreenLayout";

// For Testing
import {
  Chats,
  Home,
  Notification,
  Profile,
  Search,
} from "@/src/screens/main/mainScreenLayouts";

// For Testing
import SubscriptionDetails from "../screens/payments/SubscriptionDetails";

import { RootStackParamList } from "@/src/components/componentsType";
import { Title } from "../components/Texts";

const Stack = createNativeStackNavigator<RootStackParamList>();

const UnauthenticatedNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="CareerInfo" screenOptions={{ headerShown: false }} >
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Login" component={Login} />

      {/* For testing */}
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={optionsScreens} />
      <Stack.Screen name="OtpVerification" component={OtpVerification} options={optionsScreens} />
      <Stack.Screen name="Password" component={Password} options={optionsScreens} />
      <Stack.Screen name="SetNewPassword" component={SetNewPassword} options={optionsScreens} />
      <Stack.Screen name="SignupVerification" component={SignupVerification} options={optionsScreens} />
      <Stack.Screen name="BasicInfo" component={BasicInfo} options={ProfileScreens("Basic Info(1/6)")} />
      <Stack.Screen name="CasualInfo" component={CasualInfo} options={ProfileScreens("Casual Info(2/6)")} />
      <Stack.Screen name="AdditionalInfo" component={AdditionalInfo} options={ProfileScreens("Additional Info(4/6)")} />
      <Stack.Screen name="CareerInfo" component={CareerInfo} options={ProfileScreens("Career Info(5/6)")} />
      <Stack.Screen name="HobbiesInfo" component={HobbiesInfo} options={ProfileScreens("Hobbies Info(6/6)")} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfo} options={ProfileScreens("Personal Info(3/6)")} />
      <Stack.Screen name="Chats" component={Chats} options={optionsScreens} />
      <Stack.Screen name="Home" component={Home} options={optionsScreens} />
      <Stack.Screen name="Notification" component={Notification} options={optionsScreens} />
      <Stack.Screen name="Profile" component={Profile} options={optionsScreens} />
      <Stack.Screen name="Search" component={Search} options={optionsScreens} />

      {/* For Testing */}
      <Stack.Screen name="SubscriptionDetails" component={SubscriptionDetails} options={{ headerShown: true, headerTransparent: true, headerTitle: " ", headerTintColor: "#F2F1FF", headerRight: () => (
      <TouchableOpacity onPress={() => {}}><Text style={{ color: "#F2F1FF", fontSize: 16, fontWeight: "400", }}>Skip</Text></TouchableOpacity>
    ),}}/>
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

