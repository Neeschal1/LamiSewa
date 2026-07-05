import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { TouchableOpacity, Text } from "react-native";

import {
  ForgotPassword,
  OtpVerification,
  Password,
  SetNewPassword,
  SignupVerification,
} from "../screens/initials/initialScreensLayout";

// For Testing
import {
  BasicInfo,
  AdditionalInfo,
  CareerInfo,
  HobbiesInfo,
  PersonalInfo,
  CasualInfo,
} from "@/src/screens/profile/profileScreenLayout";


import { NavigationProps, RootStackParamList } from "@/src/components/componentsType";
import { Title } from "../components/Texts";
import { Chats, Home, NearYou, Profile, Search } from "../screens/main/mainScreenLayouts";
import { PaymentSuccess, SubscriptionDetails } from "../screens/payments/PaymentLayout";
import MyTabs from "./BottomTabNavigation";
import {AccountPassword} from "../screens/accounts/AccountLayouts";
import {BasicDetails, Documents, FacialVerification, FinalVerification, Intro, Verify} from "../screens/accounts/idverification/IDVerificationLayout";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthenticatedNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="MyTabs" screenOptions={{headerShown: false}}>
      <Stack.Screen name="OtpVerification" component={OtpVerification} options={optionsScreens} />
      <Stack.Screen name="Password" component={Password} options={optionsScreens} />
      <Stack.Screen name="SetNewPassword" component={SetNewPassword} options={optionsScreens} />
      <Stack.Screen name="BasicInfo" component={BasicInfo} options={ProfileScreens("Basic Info(1/6)")} />
      <Stack.Screen name="CasualInfo" component={CasualInfo} options={ProfileScreens("Casual Info(2/6)")} />
      <Stack.Screen name="AdditionalInfo" component={AdditionalInfo} options={ProfileScreens("Additional Info(4/6)")} />
      <Stack.Screen name="CareerInfo" component={CareerInfo} options={ProfileScreens("Career Info(5/6)")} />
      <Stack.Screen name="HobbiesInfo" component={HobbiesInfo} options={ProfileScreens("Hobbies Info(6/6)")} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfo} options={ProfileScreens("Personal Info(3/6)")} />
      <Stack.Screen name="Chats" component={Chats} options={optionsScreens} />
      <Stack.Screen name="Home" component={Home} options={optionsScreens} />
      {/* <Stack.Screen name="Notification" component={Notification} options={optionsScreens} /> */}
      <Stack.Screen name="Profile" component={Profile} options={optionsScreens} />
      <Stack.Screen name="Search" component={Search} />

      <Stack.Screen name="NearYou" component={NearYou} />

      <Stack.Screen name="SubscriptionDetails" component={SubscriptionDetails} 
      options={({ navigation }) => ({
        headerShown: true, 
        headerTransparent: true, 
        headerTitle: " ", 
        headerTintColor: "#F2F1FF", 
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate("MyTabs")}>
            <Text style={{ 
              color: "#F2F1FF", 
              fontSize: 16, 
              fontWeight: "400", 
            }}>Skip</Text>
          </TouchableOpacity>
        ),})}/>
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} options={{headerShown: false}} />

      <Stack.Screen name="MyTabs" component={MyTabs} />

      <Stack.Screen name="AccountPassword" component={AccountPassword} options={ProfileScreens("Change Password")} />

      <Stack.Screen name="BasicDetails" component={BasicDetails} options={ProfileScreens("Basic Details (1/3)")} />
      <Stack.Screen name="Documents" component={Documents} options={ProfileScreens("Change Password")} />
      <Stack.Screen name="FacialVerification" component={FacialVerification} options={ProfileScreens("Change Password")} />
      <Stack.Screen name="FinalVerification" component={FinalVerification} options={ProfileScreens("Change Password")} />
      <Stack.Screen name="Intro" component={Intro} options={optionsScreens} />
      <Stack.Screen name="Verify" component={Verify} options={ProfileScreens("Change Password")} />
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

const ProfileScreens = (title: string) => ({
  headerShown: true,
  headerTransparent: false,
  headerStyle: {backgroundColor: "#F6F5FF", width: '100%', alignItems: 'center', justifyContent: 'center', flex: 1},
  HeaderTitle: () => <Title text={title} />,
  headerTintColor: "#000000",
});

const optionsTabs = {
  headerShown: true,
  headerTransparent: true,
  headerTitle: " ",
  headerTintColor: " ",
};
