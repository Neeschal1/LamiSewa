import {
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Animated, {
  FadeInUp,
  FadeInDown,
  BounceIn,
} from "react-native-reanimated";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { getData } from "@/src/storage/Ids";
import HandleAccountCredentials from "@/src/services/accounts/credentials";

const mailInboxImage = require("@/src/assets/images/mails.png");

const SignupVerification = () => {
  const [timer, setTimer] = useState<number>(120);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [checkOTPState, setCheckOTPState] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<string>("");

  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleOTPAction = () => {
    const otpCode = otp.join("");
    if (otpCode.length != 6) {
      setCheckOTPState(true);
      setShowMessage("Enter complete OTP codes!");
    } else {
      setCheckOTPState(false);
      let stringOTP = "";
      for (let i = 0; i < otp.length; i++) {
        stringOTP += otp[i];
      }
      const numberOTP = Number(stringOTP);
      console.log("Your Entered OTP: ", numberOTP);
    }
  };

  useEffect(() => {
    const userdata = async () => {
      const details = (await getData()) as {
        fullname: string;
        email: string;
        phonenumber: string;
      };
      if (details) {
        setPhoneNumber(details.phonenumber);
        setName(details.fullname);
      }
    };

    userdata();
  }, []);

  const handleResend = async () => {
    setTimer(120);
    await HandleAccountCredentials(name, phoneNumber);
    console.log(
      "Your Data: \nFullName: ",
      name,
      "\nPhone Number: ",
      phoneNumber,
    );
  };

  const formattedTime = `00:${timer.toString().padStart(2, "0")}`;

  return (
    <SafeAreaView className="bg-background justify-center items-center flex flex-1">
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
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
              <Image source={mailInboxImage} />
            </Animated.View>
            <View className="items-center">
              <Animated.View
                entering={FadeInUp.delay(300).duration(400).springify()}
              >
                <MainScreenName text="Verify your Number" />
              </Animated.View>
              <Animated.View
                entering={FadeInUp.delay(400).duration(400).springify()}
              >
                <SubText
                  text={`We’ve sent a 6-digit verification code to +${phoneNumber} to ${name}. Please enter the code in order to verify it’s you.`}
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
                  {timer === 0 ? null : <Description text={`Code expires in ${formattedTime}`} />}
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
                  text="Continue"
                  screen="Password"
                />
              </Animated.View>
              {timer === 0 && (
                <View className="flex flex-row items-center gap-2">
                  <SubTitle text="Didn't receive the code?" />
                  <TextualButton action={handleResend} text="Resend it" />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupVerification;
