import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Splash,
  Welcome,
  Login,
  ForgetPassword,
  OtpVerification,
  Password,
  SetNewPassword,
  Signup,
  SignupVerification,
} from "../screens/initials/initialScreensLayout";
import { RootStackParamList } from "@/src/components/componentsType";

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="OtpVerification" component={OtpVerification} />
      <Stack.Screen name="Password" component={Password} />
      <Stack.Screen name="SetNewPassword" component={SetNewPassword} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="SignupVerification" component={SignupVerification} />
    </Stack.Navigator>
  );
};

export default StackNavigation;
