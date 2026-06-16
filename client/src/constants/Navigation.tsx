import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Splash, Welcome } from "../screens/initials/initialScreensLayout";

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Welcome" component={Welcome} />
    </Stack.Navigator>
  );
};

export default StackNavigation;
