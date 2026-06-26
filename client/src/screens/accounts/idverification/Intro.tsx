import { View, Text, StatusBar } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Description,
  MainScreenName,
  PrimaryButton,
} from "@/src/components/systemComponentsLayout";
import Animated, {
  FadeInUp,
  FadeInDown,
} from "react-native-reanimated";

const Intro = () => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar hidden={false} />
      <View className="flex-1 w-full bg-background p-screen items-center gap-large justify-center">
        <Animated.View
          entering={FadeInUp.delay(200).duration(400).springify()}
          className="flex items-center"
        >
          <MainScreenName text="Verify your I’d" />
          <View className="flex mt-[-10px]">
            <Description text="Let more upcoming matches reach you." />
          </View>
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(200).duration(400).springify()}
        >
          <PrimaryButton screen="BasicDetails" text="Continue" />
        </Animated.View>
      </View>
      <Animated.View
        entering={FadeInDown.delay(200).duration(400).springify()}
        className="flex items-center w-full"
      >
        <Description text="LamiSewa © 2026. All rights reserved." />
      </Animated.View>
    </SafeAreaView>
  );
};

export default Intro;
