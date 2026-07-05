import {
  View,
  StatusBar,
  Image,
  Animated,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import React, { useRef, useState } from "react";
import {
  Description,
  InputFields,
  MainScreenName,
  PrimaryButton,
  SubText,
} from "@/src/components/systemComponentsLayout";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import { SafeAreaView } from "react-native-safe-area-context";

const forgotImage = require("@/src/assets/images/confused.png");

const ForgotPassword = () => {
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isEmailMode, setIsEmailMode] = useState<boolean>(false);

  const [country, setCountry] = useState({
    cca2: "NP" as CountryCode,
    callingCode: ["977"],
  });

  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleContinue = () => {
    console.log(isEmailMode);
  };

  return (
    <SafeAreaView edges={["bottom"]} className="bg-background flex flex-1">
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 items-center justify-center bg-background p-screen">
            <StatusBar hidden translucent />

            <View className="flex items-center justify-center gap-extralarge w-full">
              <View className="flex items-center gap-large">
                <Image source={forgotImage} />

                <Animated.View
                  style={{
                    transform: [{ translateX: slideAnim }],
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <View className="items-center">
                    <MainScreenName text="Forgot Password?" />

                    <View className="flex mt-[-10px]">
                      <SubText
                        text={
                          isEmailMode
                            ? "Help us to find your account, first. Enter your email address to begin the process."
                            : "Help us to find your account, first. Enter your phone number to begin the process."
                        }
                      />
                    </View>
                  </View>
                </Animated.View>
              </View>

              {!isEmailMode ? (
                <View className="flex-row items-start border-gray-300 rounded-xl">
                  <View className="flex-row border p-4 rounded-xl justify-center border-[#CBCBCB] items-center">
                    <CountryPicker
                      countryCode={country.cca2}
                      withCallingCode
                      withFlag
                      withFilter
                      onSelect={(c: Country) =>
                        setCountry({
                          cca2: c.cca2,
                          callingCode: c.callingCode,
                        })
                      }
                    />

                    <View className="flex ml-[-5px] items-center justify-center">
                      <Description text={`+${country.callingCode[0]}`} />
                    </View>
                  </View>

                  <View className="flex-1 ml-4">
                    <InputFields
                      plchldr="eg: 9800000000"
                      state={phone}
                      setState={setPhone}
                      board="number-pad"
                    />
                  </View>
                </View>
              ) : (
                <InputFields
                  plchldr="Enter your email"
                  state={email}
                  setState={setEmail}
                  board="email-address"
                />
              )}
              <PrimaryButton
                screen="OtpVerification"
                action={handleContinue}
                text="Continue"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
