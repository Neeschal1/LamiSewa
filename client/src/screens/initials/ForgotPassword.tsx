import {
  View,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import React, { useRef, useState } from "react";
import Animated, {
  FadeInUp,
  FadeInDown,
  BounceIn,
} from "react-native-reanimated";
import {
  Description,
  ErrorText,
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
import FindAccountService from "@/src/services/accounts/findaccount";
import { useNavigation } from "expo-router";
import { NavigationProps } from "@/src/components/componentsType";
import axios from "axios";
import { saveDataString } from "@/src/storage/SecureCredentials";

const forgotImage = require("@/src/assets/images/confused.png");

const ForgotPassword = () => {
  const [phone, setPhone] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<boolean>(false);
  const [erroMessage, setErrorMessage] = useState<string>("");

  const navigation = useNavigation<NavigationProps>();

  const [country, setCountry] = useState({
    cca2: "NP" as CountryCode,
    callingCode: ["977"],
  });

  const handleContinue = async () => {
    const contact = country["callingCode"] + phone;
    try {
      setLoading(true);
      const res = await FindAccountService(contact);
      if (res.status === 200) {
        await saveDataString(res["data"]["User Detail"]);
        navigation.navigate("OtpVerification");
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const status = e.response?.status;
        const response = e.response?.data;
        if (status === 400) {
          setError(true);
          setErrorMessage(response["Message"]);
        }
      }
    } finally {
      setLoading(false);
    }
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
            <StatusBar hidden={false} translucent />

            <View className="flex items-center justify-center gap-extralarge w-full">
              <View className="flex items-center gap-large">
                <Image source={forgotImage} />

                <Animated.View
                  style={{
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <View className="items-center">
                    <MainScreenName text="Forgot Password?" />

                    <View className="flex mt-[-10px]">
                      <SubText text="Help us to find your account, first. Enter your phone number to begin the process." />
                    </View>
                  </View>
                </Animated.View>
              </View>

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

              {error ? <ErrorText text={erroMessage} /> : null}

              <PrimaryButton
                action={handleContinue}
                text={loading ? "Loading..." : "Continue"}
              />
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

export default ForgotPassword;
