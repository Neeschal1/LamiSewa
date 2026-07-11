import axios from "axios";
import {
  View,
  StatusBar,
  ImageBackground,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from "react-native";
import React, { FC, useEffect, useState } from "react";
import Animated, {
  FadeInUp,
  FadeInDown,
  BounceIn,
} from "react-native-reanimated";
import {
  Description,
  InputFields,
  MainScreenName,
  PrimaryButton,
  Title,
  SocialButton,
  SubTitle,
  TextualButton,
  InputPassword,
  ErrorText,
} from "@/src/components/systemComponentsLayout";
import HandleLoginService from "@/src/services/accounts/login";
import { useAuth } from "@/src/auth/AuthContext";

const loginBanner = require("@/src/assets/images/loginBanner.png");
const facebookLogo = require("@/src/assets/images/facebook.png");
const googleLogo = require("@/src/assets/images/google.png");

const screenheight = Dimensions.get("window").height;

const Login: FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [seePassword, setSeePassword] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [disabilityStatus, setDisabilityStatus] = useState<boolean>(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const disableButton = () => {
      if (email.trim() == "" || password.trim() == "") {
        setDisabilityStatus(true);
      } else {
        setDisabilityStatus(false);
      }
    };
    disableButton();
  }, [email, password]);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      if (email && password) {
        const Token = await HandleLoginService(email, password);
        await login(Token.accesstoken);
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const status = e.response?.status;
        const response = e.response?.data;

        if (status === 404 || status === 401) {
          setError(true);
          setErrorMessage(response["Message"]);
        }

        setTimeout(() => {
          setError(false);
          setErrorMessage("");
        }, 5000);

        console.log("Status:", e.response?.status);
        console.log("Response:", e.response?.data);
      } else {
        console.log("Issue: ", e);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-start justify-start bg-background">
      <StatusBar hidden translucent />
      <ImageBackground
        source={loginBanner}
        style={{
          height: screenheight * 0.31,
          width: "100%",
        }}
        className="items-center justify-center"
      >
        {error && (
          <Animated.View
            entering={BounceIn.delay(200).duration(300)}
            className="bg-background p-4 mt-[-60px] rounded-2xl"
            style={{
              width: "90%",
              alignItems: "center",
              paddingHorizontal: 20,
              marginTop: keyboardVisible ? -100 : undefined,
            }}
          >
            <ErrorText text={errorMessage} />
          </Animated.View>
        )}
      </ImageBackground>
      <KeyboardAvoidingView
        className="flex-1"
        style={{
          marginTop: keyboardVisible ? -50 : null,
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex w-full p-screen gap-extralarge rounded-3xl items-center mt-[-100px] bg-background">
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="flex flex-1 gap-large">
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
                    <TextualButton
                      screen="ForgotPassword"
                      text="Forgot Password"
                    />
                  </Animated.View>
                </View>
              </View>
              <Animated.View
                entering={FadeInDown.delay(800).duration(400).springify()}
              >
                <PrimaryButton
                  disability={disabilityStatus}
                  text={loading ? "Loading..." : "Login"}
                  action={handleLogin}
                />
              </Animated.View>
            </View>
          </ScrollView>
          <View className="flex w-full items-center justify-center gap-mid">
            <Animated.View
              entering={FadeInDown.delay(600).duration(400).springify()}
              className="flex items-center justify-center flex-row gap-2"
            >
              <View
                style={{ height: 1, width: "40%", backgroundColor: "black" }}
              />
              <Description text="OR" />
              <View
                style={{ height: 1, width: "40%", backgroundColor: "black" }}
              />
            </Animated.View>
            <View className="flex gap-small">
              <Animated.View
                entering={FadeInDown.delay(400).duration(400).springify()}
                className="flex gap-mid"
              >
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
              <Animated.View
                entering={FadeInDown.delay(300).duration(400).springify()}
                className="flex flex-row gap-2 justify-center items-center"
              >
                <SubTitle text="New to LamiSewa?" />
                <TextualButton text="Signup" screen="Signup" />
              </Animated.View>
            </View>
            <Animated.View
              entering={FadeInDown.delay(200).duration(400).springify()}
              className="flex items-center w-full"
            >
              <Description text="LamiSewa © 2026. All rights reserved." />
            </Animated.View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;
