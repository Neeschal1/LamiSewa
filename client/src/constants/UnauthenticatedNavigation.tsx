import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Welcome,
  Login,
  Signup,
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
    </Stack.Navigator>
  );
};

export default UnauthenticatedNavigation;