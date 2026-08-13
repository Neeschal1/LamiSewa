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
import { getData } from "@/src/storage/SecureCredentials";
import HandleAccountCredentials from "@/src/services/accounts/credentials";
import HandleOTPVerification from "@/src/services/accounts/otpverification";
import { useNavigation } from "expo-router";
import { NavigationProps } from "@/src/components/componentsType";
import axios from "axios";
import { LottieLoadingAnimation } from "@/src/constants/LoadingAnimation";

const mailInboxImage = require("@/src/assets/images/mails.png");

const SignupVerification = () => {
  const [timer, setTimer] = useState<number>(120);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [disabilityStatus, setDisabilityStatus] = useState<boolean>(true);

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

  
  useEffect(() => {
    const userdata = async () => {
      const details = (await getData()) as {
        fullname: string;
        email: string;
        contactnumber: string;
      };
      if (details) {
        setPhoneNumber(details.contactnumber);
        setName(details.fullname);
        setEmail(details.email);
      }
    };

    userdata();
  }, []);


  useEffect(()=>{
    const disablePrimaryButton = () => {
      const otpCode = otp.join("");
      if (otpCode.length === 6) {
        setDisabilityStatus(false)
      } else {
        setDisabilityStatus(true)
      }
    }
    disablePrimaryButton();
  }, [otp])


  const handleOTPAction = async () => {

    let stringOTP = "";
    for (let i = 0; i < otp.length; i++) {
      stringOTP += otp[i];
    }

    try {
      setLoading(true);
      const otpdata = HandleOTPVerification(email, stringOTP);
      const statuscode = (await otpdata).status;
      if (statuscode === 200) {
        navigation.navigate("Password");
        setLoading(false);
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const status = e.response?.status;
        const response = e.response?.data;

        if (status === 404 || status === 401 || status === 400) {
          setError(true);
          setErrorMessage(response["Message"]);
          setTimeout(() => {
            setError(false);
            setErrorMessage("");
          }, 5000);
        }
      } else {
        console.log("Issue: ", e);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setTimer(120);
    setOtp(["", "", "", "", "", ""]);
    HandleAccountCredentials(name, phoneNumber, email);
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
                  text={`We’ve sent a 6-digit verification code to +${phoneNumber}. Please enter the code in order to verify it’s you.`}
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
                key={errorMessage}
                entering={BounceIn.delay(200).duration(300)}
                className="flex items-center text-center justify-center w-full"
              >
                {error ? <View className="flex w-full items-center justify-center"><ErrorText text={errorMessage} /></View> : null}
              </Animated.View>
              <Animated.View
              className="flex w-full"
                entering={FadeInDown.delay(200).duration(400).springify()}
              >
                <PrimaryButton
                  action={handleOTPAction}
                  text="Continue"
                  disability={disabilityStatus}
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
      {loading && <LottieLoadingAnimation />}
    </SafeAreaView>
  );
};

export default SignupVerification;
