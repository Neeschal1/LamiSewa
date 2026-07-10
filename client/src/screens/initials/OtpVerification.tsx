import {
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeInUp,
  FadeInDown,
  BounceIn,
} from "react-native-reanimated";
import {
  MainScreenName,
  Title,
  SubText,
  Description,
  OTPInputFields,
  PrimaryButton,
  ErrorText,
  TextualButton,
  SubTitle,
} from "@/src/components/systemComponentsLayout";
import { getDataString } from "@/src/storage/Ids";
import HandleForgotPasswordOTPVerification from "@/src/services/accounts/forgotpasswordotp";
import { useNavigation } from "expo-router";
import { NavigationProps } from "@/src/components/componentsType";
import axios from "axios";

const confusedImage = require("@/src/assets/images/confused.png");

const OtpVerification = () => {
  const [timer, setTimer] = useState<number>(60);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [checkOTPState, setCheckOTPState] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigation = useNavigation<NavigationProps>();

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleOTPAction = async () => {
    const otpCode = otp.join("");
    if (otpCode.length != 6) {
      setCheckOTPState(true);
      setShowMessage("Enter complete OTP codes!");
      return;
    } else {
      setCheckOTPState(false);
    }
    let stringOTP = "";
    for (let i = 0; i < otp.length; i++) {
      stringOTP += otp[i];
    }
    try {
      setLoading(true);
      const userid = Number(await getDataString());
      console.log(
        "User's ID: ",
        userid,
        "Datatype: ",
        typeof userid,
        "Entered OTP: ",
        stringOTP,
        "Type of entered otp: ",
        typeof stringOTP,
      );
      const res = await HandleForgotPasswordOTPVerification(userid, stringOTP);
      if (res["status"] === 200) {
        setLoading(false);
        console.log("Data: ", res["data"])
        navigation.navigate("SetNewPassword");
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const status = e.response?.status;
        const response = e.response?.data;

        console.log(
          "Response from server: ",
          response,
          "It's status code: ",
          status,
        );

        if (status === 404 || status === 401 || status === 400) {
          setCheckOTPState(true);
          setShowMessage(response["Message"]);
          setTimeout(() => {
            setError(false);
            setErrorMessage("");
          }, 5000);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setTimer(120);
    // HandleAccountCredentials(name, phoneNumber, email);
  };

  const formattedTime = `00:${timer.toString().padStart(2, "0")}`;

  return (
    <SafeAreaView className="bg-background justify-center items-center flex flex-1">
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        className="flex-1 flex"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 items-center justify-center bg-background p-screen gap-extralarge">
            <Animated.View
              entering={FadeInUp.delay(200).duration(400).springify()}
            >
              <Image source={confusedImage} />
            </Animated.View>
            <View className="items-center">
              <Animated.View
                entering={FadeInUp.delay(300).duration(400).springify()}
              >
                <MainScreenName text="Verification" />
              </Animated.View>
              <Animated.View
                entering={FadeInUp.delay(400).duration(400).springify()}
              >
                <SubText
                  text={`We’ve sent a 6-digit verification code to you. Please enter the code in order to verify it’s you.`}
                />
              </Animated.View>
            </View>

            <View className="w-full items-center gap-large">
              <Animated.View
                entering={FadeInDown.delay(400).duration(400).springify()}
                className="flex gap-mid"
              >
                <View className="flex flex-row items-center w-full justify-between">
                  <Title text="Enter your Code" />
                  {timer === 0 ? null : (
                    <Description text={`Code expires in ${formattedTime}`} />
                  )}
                </View>
                <View className="flex-row gap-2">
                  <OTPInputFields otp={otp} setOtp={setOtp} />
                </View>
              </Animated.View>
              <Animated.View
                key={showMessage}
                entering={BounceIn.delay(200).duration(300)}
                className="ml-[-20px] flex items-center text-center justify-center w-full"
              >
                {checkOTPState ? <ErrorText text={showMessage} /> : null}
              </Animated.View>
              <Animated.View
                entering={FadeInDown.delay(200).duration(400).springify()}
              >
                <PrimaryButton
                  action={handleOTPAction}
                  text={loading ? "Loading..." : "Continue"}
                />
              </Animated.View>
              {timer === 0 && (
                <View className="flex flex-column items-center gap-2">
                  <SubTitle text="Code expired or didn't received it?" />
                  <TextualButton action={handleResend} text="Resend it" />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Animated.View
        entering={FadeInDown.delay(200).duration(400).springify()}
        className="flex items-center w-full"
      >
        <Description text="LamiSewa © 2026. All rights reserved." />
      </Animated.View>
    </SafeAreaView>
  );
};

export default OtpVerification;
