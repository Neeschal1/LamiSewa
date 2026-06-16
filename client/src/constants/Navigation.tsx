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
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen
        name="ForgetPassword"
        component={ForgetPassword}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: " ",
          headerTintColor: "#000000",
        }}
      />
      <Stack.Screen
        name="OtpVerification"
        component={OtpVerification}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: " ",
          headerTintColor: "#000000",
        }}
      />
      <Stack.Screen
        name="Password"
        component={Password}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: " ",
          headerTintColor: "#000000",
        }}
      />
      <Stack.Screen
        name="SetNewPassword"
        component={SetNewPassword}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: " ",
          headerTintColor: "#000000",
        }}
      />
      <Stack.Screen
        name="SignupVerification"
        component={SignupVerification}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: " ",
          headerTintColor: "#000000",
        }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigation;
