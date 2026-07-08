import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  BasicInfo,
  AdditionalInfo,
  CareerInfo,
  HobbiesInfo,
  PersonalInfo,
  CasualInfo,
} from "@/src/screens/profile/profileScreenLayout";
import { RootStackParamList } from "../components/componentsType";
import { Title } from "../components/Texts";

const Stack = createNativeStackNavigator<RootStackParamList>();

const ProfileScreenNavigation = () => {
    return (
        <Stack.Navigator initialRouteName="BasicInfo" screenOptions={{headerShown: false}}>
            <Stack.Screen name="BasicInfo" component={BasicInfo} options={ProfileScreens("Basic Info(1/6)")} />
            <Stack.Screen name="CasualInfo" component={CasualInfo} options={ProfileScreens("Casual Info(2/6)")} />
            <Stack.Screen name="AdditionalInfo" component={AdditionalInfo} options={ProfileScreens("Additional Info(4/6)")} />
            <Stack.Screen name="CareerInfo" component={CareerInfo} options={ProfileScreens("Career Info(5/6)")} />
            <Stack.Screen name="HobbiesInfo" component={HobbiesInfo} options={ProfileScreens("Hobbies Info(6/6)")} />
            <Stack.Screen name="PersonalInfo" component={PersonalInfo} options={ProfileScreens("Personal Info(3/6)")} />
        </Stack.Navigator>
    )
}

export default ProfileScreenNavigation

const ProfileScreens = (title: string) => ({
  headerShown: true,
  headerTransparent: false,
  headerStyle: {backgroundColor: "#F6F5FF", width: '100%', alignItems: 'center', justifyContent: 'center', flex: 1},
  HeaderTitle: () => <Title text={title} />,
  headerTintColor: "#000000",
});