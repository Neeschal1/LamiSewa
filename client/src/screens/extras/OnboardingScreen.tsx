import React, { FC } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import LottieView from "lottie-react-native";
import { SubHeading, SubText } from "@/src/components/systemComponentsLayout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import { NavigationProps } from "@/src/components/componentsType";

const dating = require("@/src/assets/animations/dating.json");
const chatting = require("@/src/assets/animations/chatting.json");
const marriage = require("@/src/assets/animations/marriage.json");

const navigatingScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  navigation.navigate("Welcome")
};

const SkipButton = ({ onPress }: any) => (
  <TouchableOpacity
    className="px-mid py-small"
    activeOpacity={0.8}
    onPress={async () => {
      await AsyncStorage.setItem("onboardingState", "completed");
      onPress();
      navigatingScreen()
    }}
  >
    <SubText text="Skip" />
  </TouchableOpacity>
);

const NextButton = ({ ...props }) => (
  <TouchableOpacity
    className="bg-primaryblue rounded-full px-8 py-5"
    activeOpacity={0.8}
    {...props}
  >
    <SubHeading text="Next" />
  </TouchableOpacity>
);

const DoneButton = ({ onPress }: any) => (
  <TouchableOpacity
    className="bg-primaryred rounded-full px-8 py-5"
    activeOpacity={0.8}
    onPress={async () => {
      await AsyncStorage.setItem("onboardingState", "completed");
      onPress();
      navigatingScreen()
    }}
  >
    <SubHeading text="Done" />
  </TouchableOpacity>
);

const Dot = ({ selected }: { selected: boolean }) => {
  return (
    <View
      className={`mx-1 rounded-full ${
        selected ? "bg-primaryblue w-4 h-2" : "bg-gray-300 w-2 h-2"
      }`}
    />
  );
};

const OnboardingScreen: FC = () => {
  return (
    <View className="flex-1 bg-background">
      <Onboarding
        showSkip
        bottomBarHighlight={false}
        controlStatusBar={false}
        SkipButtonComponent={SkipButton}
        NextButtonComponent={NextButton}
        DoneButtonComponent={DoneButton}
        DotComponent={Dot}
        titleStyles={{
          fontFamily: "Poppinssemibold",
          fontSize: 22,
          color: "#000000",
          marginTop: 10,
        }}
        subTitleStyles={{
          fontFamily: "Poppinsregular",
          fontSize: 14,
          color: "#8F8F8F",
          paddingHorizontal: 28,
          lineHeight: 22,
          textAlign: "center",
        }}
        pages={[
          {
            backgroundColor: "#F5F7FF",
            image: (
              <LottieView
                source={chatting}
                autoPlay
                loop
                style={{
                  width: 320,
                  height: 320,
                }}
              />
            ),
            title: "Start Meaningful Conversations",
            subtitle:
              "Connect with verified people and begin genuine conversations that matter.",
          },
          {
            backgroundColor: "#FFF4F8",
            image: (
              <LottieView
                source={dating}
                autoPlay
                loop
                style={{
                  width: 320,
                  height: 320,
                }}
              />
            ),
            title: "Discover Your Perfect Match",
            subtitle:
              "Explore compatible profiles based on your interests, values, and lifestyle.",
          },
          {
            backgroundColor: "#F5FFF8",
            image: (
              <LottieView
                source={marriage}
                autoPlay
                loop
                style={{
                  width: 320,
                  height: 320,
                }}
              />
            ),
            title: "Build a Lifetime Together",
            subtitle:
              "Take the next step toward a meaningful relationship and a brighter future.",
          },
        ]}
      />
    </View>
  );
};

export default OnboardingScreen;
