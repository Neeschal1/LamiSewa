import {
  View,
  Text,
  StatusBar,
  ImageBackground,
  Dimensions,
} from "react-native";
import React, { FC, useState } from "react";
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
          <View>
            <MainScreenName text="Login" />
            <View className="mt-[-10px]">
              <Description text="Login to find your perfect match through LamiSewa." />
            </View>
          </View>
          <View className="flex w-full items-end gap-small">
            <View className="flex gap-mid">
              <View className="items-start w-full">
                <Title text="Email" />
                <InputFields
                  plchldr="example@gmail.com"
                  state={email}
                  setState={setEmail}
                  board="default"
                />
              </View>
              <View className="items-start w-full">
                <Title text="Password" />
                <InputPassword
                  plchldr="***********"
                  state={password}
                  setState={setPassword}
                  board="default"
                  visibility={seePassword}
                  setVisibility={setSeePassword}
                />
              </View>
            </View>
            <View className="flex flex-end">
              <TextualButton screen="ForgotPassword" text="Forgot Password" />
            </View>
          </View>
        </View>
        <PrimaryButton text="Login" />
        <View className="flex w-full items-center justify-center gap-mid">
          <View className="flex items-center justify-center flex-row gap-2">
            <View
              style={{ height: 1, width: "40%", backgroundColor: "black" }}
            />
            <Description text="OR" />
            <View
              style={{ height: 1, width: "40%", backgroundColor: "black" }}
            />
          </View>
          <View className="flex gap-small">
            <View className="flex gap-mid">
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
            </View>
            <View className="flex flex-row gap-2 justify-center items-center">
              <SubTitle text="New to LamiSewa?" />
              <TextualButton text="Signup" screen="Signup" />
            </View>
          </View>
          <View className="flex items-center w-full">
            <Description text="LamiSewa © 2026. All rights reserved." />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Login;
