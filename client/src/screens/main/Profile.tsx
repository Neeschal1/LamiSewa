import {
  View,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  Image,
  Dimensions,
  Text,
  Touchable,
  ScrollView,
  Pressable,
  Linking,
  Switch,
} from "react-native";
import React, { FC, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Describe,
  Description,
  Heading,
  MainScreenName,
  SecondaryButton,
  SubHeading,
  SubText,
  SubTitle,
  Title,
} from "@/src/components/systemComponentsLayout";
import {
  NavigationProps,
  RootStackParamList,
} from "@/src/components/componentsType";
import { useNavigation } from "expo-router";
import { useAuth } from "@/src/auth/AuthContext";
import FetchUsersDetail from "@/src/services/settings/fetchDetails";

type OthersScreen =
  | "PrivacyPolicy"
  | "TermsOfUse"
  | "Help"
  | "ContactUs"
  | "Documents" 
  | "AboutUs"

type AccountType = {
  item: number;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  btnname: string;
  headto: keyof RootStackParamList;
};

type OthersType = {
  item: number;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  btnname: string;
  redirect: OthersScreen;
};

interface Profile {
  useremail: string;
  username: string;
  profileid: string;
  userid: number;
}

interface BasicInfo {
  fullname: string;
  nickname: string;
  bio: string;
  profile_picture: string;
  cover_picture: string;
  profile_handler: string;
  gender: string;
  date_of_birth: string;
}

interface UserData {
  profile: Profile;
  basic_info: BasicInfo;
}

const CoverPP = require("@/src/assets/images/cover.png");
const myProfile = require("@/src/assets/images/myPP.png");

const Verification = require("@/src/assets/icons/verified.png");

const FeaturePhotoes = [
  { item: 1, image: require("@/src/assets/images/feature1.png") },
  { item: 2, image: require("@/src/assets/images/feature2.png") },
  { item: 3, image: require("@/src/assets/images/feature3.png") },
  { item: 4, image: require("@/src/assets/images/feature4.png") },
  { item: 5, image: require("@/src/assets/images/feature5.png") },
  { item: 6, image: require("@/src/assets/images/feature6.png") },
];

const Accounts: AccountType[] = [
  {
    item: 1,
    icon: "person",
    btnname: "Edit Profile",
    headto: "AccountPassword",
  },
  {
    item: 2,
    icon: "checkmark-circle",
    btnname: "Verify your ID",
    headto: "Intro",
  },
  {
    item: 3,
    icon: "lock-closed",
    btnname: "Change Password",
    headto: "AccountPassword",
  },
  { item: 4, icon: "earth", btnname: "Language", headto: "AccountPassword" },
];

const Others: OthersType[] = [
  {
    item: 1,
    icon: "shield-checkmark",
    btnname: "Privacy Policy",
    redirect: "PrivacyPolicy",
  },
  {
    item: 2,
    icon: "newspaper",
    btnname: "Terms of Use",
    redirect: "TermsOfUse",
  },
  {
    item: 3,
    icon: "information-circle",
    btnname: "Help",
    redirect: "Help",
  },
  {
    item: 4,
    icon: "people-circle",
    btnname: "Contact Us",
    redirect: "ContactUs",
  },
  {
    item: 5,
    icon: "accessibility-outline",
    btnname: "About Us",
    redirect: "AboutUs",
  },
];

const { width, height } = Dimensions.get("window");

const Profile: FC = () => {
  const { logout } = useAuth();
  const [enabled, setEnabled] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const navigation = useNavigation<NavigationProps>();

  const handleLogOut = async () => {
    await logout();
  };

  useEffect(() => {
    const fetchUserBasicInfo = async () => {
      const data = await FetchUsersDetail();
      console.log("Message: ", data.data);
      console.log("Status: ", data.stats);
      setUserData(data);
    };
    fetchUserBasicInfo();
  }, []);

  return (
    <View className="flex-1 items-center justify-start bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
        }}
      >
        <StatusBar hidden={false} translucent />

        <ImageBackground
          source={{ uri: userData?.basic_info.cover_picture }}
          style={{
            width: width,
            height: height * 0.22,
          }}
          className="items-end pt-10 pr-6 w-full flex-end"
          resizeMode="cover"
        >
          <View className="flex w-full justify-end pt-4 items-end flex-row gap-small">
            <TouchableOpacity className="w-12 h-12 rounded-full bg-[#2277F7] items-center justify-center">
              <Ionicons name="diamond" size={24} color="#F2F1FF" />
            </TouchableOpacity>
            <TouchableOpacity className="flex items-center justify-center bg-background w-12 h-12 rounded-full">
              <Ionicons name="menu" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity className="flex items-center justify-center bg-background w-12 h-12 rounded-full">
              <Ionicons name="share-social-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <View
          style={{
            marginTop: -height * 0.1,
          }}
          className="flex-row items-center justify-between w-full p-screen"
        >
          <View className="flex flex-col w-full items-center gap-mid">
            <Pressable
              onPress={() => {
                console.log("Profile pic pressed!");
              }}
              style={{
                width: width * 0.35,
                height: width * 0.35,
                borderRadius: (width * 0.25) / 2,
                overflow: "hidden",
              }}
            >
              <View className="flex py-2 px-2 border-4 border-primaryblue bg-background rounded-full">
                <Image
                  source={{ uri: userData?.basic_info.profile_picture }}
                  style={{
                    width: "100%",
                    height: "100%",
                    resizeMode: "cover",
                    borderRadius: 100,
                  }}
                />
              </View>
            </Pressable>
            <View className="gap-small w-full items-center">
              <View className="flex items-center">
                <View className="flex flex-row items-center justify-center gap-small">
                  <Text className="font-Poppinssemibold text-dark text-[24px]">
                    {userData?.basic_info.fullname}
                  </Text>
                  <Image source={Verification} />
                </View>
                <View className="flex mt-[-10px]">
                  {/* <Description text={`${userData?.career_info.occupation}`}/> */}
                </View>
              </View>
              <SubTitle text={`${userData?.basic_info.bio}`} />
              <View className="flex flex-row gap-mid">
                <TouchableOpacity className="flex bg-[#FFFFFF] px-4 py-2 rounded-2xl">
                  <SubTitle text="Matching: 28" />
                </TouchableOpacity>
                <TouchableOpacity className="flex bg-primaryred px-4 py-2 rounded-2xl">
                  <Text className="font-Poppinsregular text-background text-subheading">
                    Matched: 12
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View className="flex py-4">
          <TouchableOpacity className="flex flex-row bg-[#9621C5] items-center gap-mid w-full px-20 rounded-xl py-4">
            <Ionicons name="diamond" color="white" size={24} />
            <Text className="font-Poppinsmedium text-background text-subheading">
              Purchase Membership
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex items-start w-full p-screen">
          <View className="flex justify-between flex-row w-full">
            <Description text="Your Pictures" />
            <TouchableOpacity className="mr-2">
              <SubText text="Tap to Edit" />
            </TouchableOpacity>
          </View>
          <Pressable
            onPress={() => navigation.navigate("FeaturedPhoto")}
            className="flex items-center justify-center w-full bg-[#ecebff] rounded-2xl border-[#FFFFFF]"
          >
            <View className="flex items-center justify-center py-14">
              <Ionicons name="camera" size={30} />
              <SubTitle text="Choose from Gallery" />
            </View>
          </Pressable>
          {/* <View className="flex flex-row flex-wrap w-full">
            {FeaturePhotoes.map((index) => (
              <TouchableOpacity
                className="flex flex-row w-[33%] py-extrasmall"
                key={index.item}
              >
                <Image
                  className="h-[118px] w-[113px] rounded-2xl pr-extrasmall"
                  source={index.image}
                />
              </TouchableOpacity>
            ))}
          </View> */}
        </View>

        <View className="flex w-full items-start p-screen">
          <Description text="Account" />
          <View className="mt-4 gap-mid">
            {Accounts.map((index) => (
              <TouchableOpacity
                key={index.item}
                className="flex flex-row justify-between w-full"
                // onPress={()=>{navigation.navigate(index.headto)}}
              >
                <View className="flex flex-row gap-mid">
                  <Ionicons name={index.icon} size={24} />
                  <SubTitle text={index.btnname} />
                </View>
                <Ionicons
                  name="chevron-forward-outline"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="flex w-full items-start p-screen">
          <Description text="Notification" />
          <View className="gap-mid w-full flex-row items-center justify-between">
            <View className="flex flex-row gap-mid">
              <Ionicons name="notifications" size={24} color="black" />
              <SubTitle text="App Notification" />
            </View>
            <Switch
              value={enabled}
              onValueChange={setEnabled}
              trackColor={{ false: "#BBBDC8", true: "#FF000E" }}
              thumbColor={enabled ? "#FFFFFF" : "#FFFFFF"}
            />
          </View>
        </View>

        <View className="flex w-full items-start p-screen">
          <Description text="Others" />
          <View className="mt-4 gap-mid w-full">
            {Others.map((index) => (
              <TouchableOpacity
                onPress={() => {
                  console.log("Redirect:", index.redirect);
                  navigation.navigate(index.redirect);
                }}
                key={index.item}
                className="flex flex-row w-full gap-mid"
              >
                <View className="flex flex-row gap-mid">
                  <Ionicons name={index.icon} size={24} />
                  <SubTitle text={index.btnname} />
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={async () => {
                await logout();
              }}
              className="flex flex-row w-full gap-mid"
            >
              <View className="flex flex-row gap-mid">
                <Ionicons name="log-out" size={24} />
                <SubTitle text="Log Out" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex flex-row gap-4"></View>
      </ScrollView>
    </View>
  );
};

export default Profile;
