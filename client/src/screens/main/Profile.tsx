import {
  View,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  Image,
  Dimensions,
  Text,
} from "react-native";
import React, { FC } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Describe,
  Description,
  Heading,
  MainScreenName,
  SubHeading,
  SubText,
  SubTitle,
  Title,
} from "@/src/components/Texts";

const CoverPP = require("@/src/assets/images/cover.png");
const myProfile = require("@/src/assets/images/myPP.png");

const { width, height } = Dimensions.get("window");

const Profile: FC = () => {
  return (
    <View className="flex-1 items-center justify-start bg-background">
      <StatusBar hidden={false} translucent />

      <ImageBackground
        source={CoverPP}
        style={{
          width: width,
          height: height * 0.28,
        }}
        className="items-end pt-10 pr-6"
        resizeMode="cover"
      >
        <TouchableOpacity className="w-12 h-12 rounded-full bg-[#2277F7] items-center justify-center">
          <Ionicons name="diamond" size={24} color="#F2F1FF" />
        </TouchableOpacity>
      </ImageBackground>

      <View
        style={{
          marginTop: -height * 0.08,
        }}
        className="flex-row items-start justify-between w-full p-screen"
      >
        <View className="flex flex-col gap-mid">
          <TouchableOpacity
            style={{
              width: width * 0.35,
              height: width * 0.35,
              borderRadius: (width * 0.25) / 2,
              overflow: "hidden",
            }}
          >
            <Image
              source={myProfile}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "cover",
              }}
            />
          </TouchableOpacity>
          <View className="gap-small">
            <View>
              <Text className="font-Poppinssemibold text-dark text-[24px]">
                Neeschal Pokharel
              </Text>
              <View className="flex mt-[-10px]">
                <Description text="Mobile Application Developer" />
              </View>
            </View>
            <SubTitle text="Hey, beautiful Soul...!" />
            <View className="flex flex-row gap-mid">
              <TouchableOpacity className="flex bg-[#FFFFFF] px-4 py-2 rounded-2xl">
                <SubTitle text="Matching: 28" />
              </TouchableOpacity>
              <TouchableOpacity className="flex bg-primaryred px-4 py-2 rounded-2xl">
                <Text className="font-Poppinsregular text-background text-subheading">Matched: 12</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity className="bg-primaryblue px-5 py-3 mt-6 ml-[-64px] rounded-2xl">
          <SubHeading text="Favourite list" />
        </TouchableOpacity>
      </View>

      <View className="flex items-start w-full p-screen">
        <SubText text="Your Pictures" />
      </View>
    </View>
  );
};

export default Profile;
