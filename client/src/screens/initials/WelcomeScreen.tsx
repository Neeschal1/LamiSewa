import {
  View,
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
import React, { FC } from "react";
import Animated, {
  FadeIn,
  FadeOut,
  FadeInUp,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  BounceIn,
} from "react-native-reanimated";

const Welcomecontents = require("@/src/assets/images/welcomeBanner.png");
const logo = require("@/src/assets/images/mainLogo.png");

const screenheight = Dimensions.get("window").height;
const screenwidth = Dimensions.get("window").width;

const Welcome: FC = () => {
  return (
    <View className="flex-1">
      <StatusBar hidden translucent />
      <ImageBackground
        className="h-full w-full justify-end align-center p-screen items-center"
        source={Welcomecontents}
      >
        <View className="flex justify-center items-center mb-mid gap-small">
          <Animated.View entering={FadeInUp.delay(400).duration(800).springify()}>
            <Image
            style={{ width: screenwidth * 0.7, height: screenheight * 0.143 }}
            source={logo}
          />
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(200).duration(600).springify()}>
            <PrimaryButton screen="Signup" text="Let's Begin" />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(200).duration(600).springify()}  className="flex flex-row gap-2 justify-center items-center">
            <SubTitle text="Already have an account?" />
            <TextualButton text="Login" screen="Login" />
          </Animated.View>
        </View>
        <Animated.View entering={FadeInDown.delay(400).duration(800).springify()}>
          <Description text="LamiSewa © 2026. All rights reserved." />
        </Animated.View>
      </ImageBackground>
    </View>
  );
};

export default Welcome;
