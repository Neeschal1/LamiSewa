import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Welcome,
  Login,
  Signup,
  SignupVerification,
  ForgotPassword,
  Password,
} from "@/src/screens/initials/initialScreensLayout";
import { RootStackParamList } from "../components/componentsType";

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

      <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={optionsScreens} />
      <Stack.Screen name="SignupVerification" component={SignupVerification} options={optionsScreens} />
      <Stack.Screen name="Password" component={Password} options={optionsScreens} />
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