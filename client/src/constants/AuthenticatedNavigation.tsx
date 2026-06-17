import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  ForgotPassword,
  OtpVerification,
  Password,
  SetNewPassword,
  SignupVerification,
  Splash,
} from "../screens/initials/initialScreensLayout";
import { RootStackParamList } from "@/src/components/componentsType";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthenticatedNavigation = () => {
  return (
    <Stack.Navigator>
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
