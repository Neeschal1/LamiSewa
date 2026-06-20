import {
  View,
  Text,
  StatusBar,
  ImageBackground,
  Dimensions,
} from "react-native";
import React, { FC, useState } from "react";
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
import {
  Description,
  InputFields,
  MainScreenName,
  PrimaryButton,
  Title,
  ErrorText,
  SocialButton,
  SubTitle,
  TextualButton,
  InputPassword,
} from "@/src/components/systemComponentsLayout";

const loginBanner = require("@/src/assets/images/loginBanner.png");
const facebookLogo = require("@/src/assets/images/facebook.png");
const googleLogo = require("@/src/assets/images/google.png");

const screenheight = Dimensions.get("window").height;

const Login: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [seePassword, setSeePassword] = useState<boolean>(false);

  return (
    <View className="flex-1 items-start justify-start bg-background">
      <StatusBar hidden translucent />
      <ImageBackground
        style={{
          height: screenheight * 0.31,
          width: "100%",
        }}
        className="w-full flex h-10"
        source={loginBanner}
      >
        <View></View>
      </ImageBackground>
      <View className="flex w-full p-screen rounded-3xl gap-extralarge items-center mt-[-100px] bg-background">
        <View className="flex gap-large">
          <Animated.View
            entering={FadeInUp.delay(200).duration(400).springify()}
          >
            <MainScreenName text="Login" />
            <View className="mt-[-10px]">
              <Description text="Login to find your perfect match through LamiSewa." />
            </View>
          </Animated.View>
          <View className="flex w-full items-end gap-small">
            <View className="flex gap-mid">
              <Animated.View
                entering={FadeInUp.delay(400).duration(400).springify()}
                className="items-start w-full"
              >
                <Title text="Email" />
                <InputFields
                  plchldr="example@gmail.com"
                  state={email}
                  setState={setEmail}
                  board="default"
                />
              </Animated.View>
              <Animated.View
                entering={FadeInUp.delay(600).duration(400).springify()}
                className="items-start w-full"
              >
                <Title text="Password" />
                <InputPassword
                  plchldr="***********"
                  state={password}
                  setState={setPassword}
                  board="default"
                  visibility={seePassword}
                  setVisibility={setSeePassword}
                />
              </Animated.View>
            </View>
            <Animated.View
              entering={FadeInUp.delay(800).duration(400).springify()}
              className="flex flex-end"
            >
              <TextualButton screen="ForgotPassword" text="Forgot Password" />
            </Animated.View>
          </View>
        </View>
        <Animated.View entering={FadeInDown.delay(800).duration(400).springify()}>
          <PrimaryButton text="Login" />
        </Animated.View>
        <View className="flex w-full items-center justify-center gap-mid">
          <Animated.View entering={FadeInDown.delay(600).duration(400).springify()} className="flex items-center justify-center flex-row gap-2">
            <View
              style={{ height: 1, width: "40%", backgroundColor: "black" }}
            />
            <Description text="OR" />
            <View
              style={{ height: 1, width: "40%", backgroundColor: "black" }}
            />
          </Animated.View>
          <View className="flex gap-small">
            <Animated.View entering={FadeInDown.delay(400).duration(400).springify()} className="flex gap-mid">
              <SocialButton
                text="Continue with Facebook"
                btnname="facebook"
                logo={facebookLogo}
              />
              <SocialButton
                text="Continue with Google"
                btnname="google"
                logo={googleLogo}
              />
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(300).duration(400).springify()} className="flex flex-row gap-2 justify-center items-center">
              <SubTitle text="New to LamiSewa?" />
              <TextualButton text="Signup" screen="Signup" />
            </Animated.View>
          </View>
          <Animated.View entering={FadeInDown.delay(200).duration(400).springify()} className="flex items-center w-full">
            <Description text="LamiSewa © 2026. All rights reserved." />
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

export default Login;
