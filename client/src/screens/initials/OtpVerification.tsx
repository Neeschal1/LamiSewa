import { View, Image, TextInput,   KeyboardAvoidingView,
  Platform, } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  MainScreenName,
  Title,
  SubText,
  Description,
  InputFields,
  OTPInputFields,
  PrimaryButton,
  ErrorText,
  TextualButton,
  SubTitle,
} from "@/src/components/systemComponentsLayout";

const confusedImage = require("@/src/assets/images/confused.png");

const OtpVerification = () => {
  const [timer, setTimer] = useState<number>(60);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [checkOTPState, setCheckOTPState] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<string>("");

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
      let stringOTP = ""
      for(let i=0; i<otp.length; i++){
        stringOTP += otp[i]
      }
      const numberOTP = Number(stringOTP)
      console.log("Your Entered OTP: ", numberOTP);
    }
  };

  const formattedTime = `00:${timer.toString().padStart(2, "0")}`;

  return (
    <View className="flex-1 items-center justify-center bg-background p-screen mt-[-60px]">
      <View className="flex items-center justify-center gap-extralarge w-full">
        <Image source={confusedImage} />
      <View className="items-center">
        <MainScreenName text="Verification" />
        <SubText text="We’ve sent you a 6-digit verification code. Please enter the code in order to verify it’s you." />
      </View>

      <View className="w-full items-center gap-large">
        <View className="flex gap-mid">
          <View className="flex flex-row items-center w-full justify-between">
            <Title text="Enter your Code" />
            <Description text={`Code expires in ${formattedTime}`} />
          </View>
          <View className="flex-row gap-2">
            <OTPInputFields otp={otp} setOtp={setOtp} />
          </View>
        </View>
        <View className="ml-[-20px] flex items-center text-center justify-center w-full">
          {checkOTPState ? <ErrorText text={showMessage} /> : null}
        </View>
        <PrimaryButton action={handleOTPAction} text="Continue" />
        {timer === 0 && (
          <View className="flex flex-row items-center gap-2">
            <SubTitle text="Didn't receive the code?" />
            <TextualButton text="Resend it" />
          </View>
        )}
      </View>
      </View>
    </View>
  );
};

export default OtpVerification;
