import {
  View,
  Text,
  ImageBackground,
  StatusBar,
  Image,
  Dimensions,
} from "react-native";
import {
    Description,
  PrimaryButton,
  SubTitle,
  TextualButton,
} from "@/src/components/systemComponentsLayout";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Welcomecontents = require("@/src/assets/images/welcomeBanner.png");
const logo = require("@/src/assets/images/mainLogo.png");

const screenheight = Dimensions.get("window").height;
const screenwidth = Dimensions.get("window").width;

const PrimaryButtonAction = () => {
  console.log("Primary Button Pressed!");
};

const TextualButtonAction = () => {
  console.log("Signup Button Pressed!");
};

const Welcome = () => {
  return (
    <View className="flex-1">
      <StatusBar hidden translucent />
      <ImageBackground
        className="h-full w-full justify-end align-center p-screen items-center"
        source={Welcomecontents}
      >
        <View className="flex justify-center items-center mb-mid gap-small">
          <Image
            style={{ width: screenwidth * 0.7, height: screenheight * 0.143 }}
            source={logo}
          />
          <PrimaryButton text="Let's Begin" action={PrimaryButtonAction} />
          <View className="flex flex-row gap-2 justify-center items-center">
            <SubTitle text="Already have an account?" />
            <TextualButton text="Login" action={TextualButtonAction} />
          </View>
        </View>
        <Description text="Bihebari © 2026. All rights reserved." />
      </ImageBackground>
    </View>
  );
};

export default Welcome;
