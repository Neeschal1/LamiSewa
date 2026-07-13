import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import LottieView from "lottie-react-native";
import Animated, {
  FadeInUp,
  FadeInDown,
  BounceIn,
} from "react-native-reanimated";
import React, { FC, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Description,
  ErrorText,
  InputFields,
  PrimaryButton,
  SubTitle,
  Title,
} from "@/src/components/systemComponentsLayout";
import { useNavigation } from "expo-router";
import { NavigationProps } from "@/src/components/componentsType";
import { getData } from "@/src/storage/SecureCredentials";
import UserProfileService from "@/src/services/profile/userinfo";
import axios from "axios";
import { clearToken } from "@/src/storage/SecureTokens";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/src/auth/AuthContext";
import { GetStringDataAsync, StoreStringDataAsync } from "@/src/storage/ProfileDataAsync";

const createProfileAnimation = require("@/src/assets/animations/createProfile.json");

const UserInfo: FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigation = useNavigation<NavigationProps>();

  const handleProceed = async () => {
    const userscredentials = await getData();
    const usersemail = userscredentials["email"];
    console.log("Profile screen status before userinfo screen validation: ", await GetStringDataAsync("UserProfileStatus"))

    if (userName === "") {
      setError(true);
      setErrorMessage("Username cannot be empty!");
      return;
    }

    try {
      setLoading(true);
      const res = await UserProfileService(usersemail, userName);

      if (res["status"] === 201) {
        setLoading(false);
        await StoreStringDataAsync("UserProfileStatus", "UserInfoCompleted")
        console.log("Profile screen status after validation: ", await GetStringDataAsync("UserProfileStatus"))
        navigation.navigate("BasicInfo");
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const data = e.response?.data;
        const status = e.response?.status;

        console.log("Data: ", data);
        console.log("Status: ", status);

        if (status === 409) {
          setError(true);
          setErrorMessage("User with that username already exists!");
          setTimeout(() => {
            setError(false);
            setErrorMessage("");
          }, 5000);
          return;
        }

        if (status === 417) {
          setError(true);
          setErrorMessage("Please select a different username.");
          setTimeout(() => {
            setError(false);
            setErrorMessage("");
          }, 5000);
          return;
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const { logout } = useAuth();

  return (
    <SafeAreaView edges={["bottom"]} className="bg-background flex flex-1 ">
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={{ flex: 1, marginTop: 10 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 items-center justify-center mt-20 p-screen bg-background gap-large pt-extralarge">
            <StatusBar hidden={false} translucent />
            <Animated.View
              entering={FadeInUp.delay(200).duration(400).springify()}
              className="flex items-center"
            >
              <SubTitle text="Let's create your Profile before continuing..." />
              <LottieView
                source={createProfileAnimation}
                autoPlay
                loop
                style={{
                  width: 250,
                  height: 250,
                }}
              />
            </Animated.View>
            {error ? (
              <Animated.View
                key={errorMessage}
                entering={BounceIn.delay(200).duration(300)}
              >
                <ErrorText text={`${errorMessage}`} />
              </Animated.View>
            ) : null}
            <View className="flex gap-mid items-start">
              <Animated.View
                entering={FadeInUp.delay(200).duration(400).springify()}
                className="items-start w-full"
              >
                <Title text={`Username:`} />
                <InputFields
                  plchldr="eg: neeschal123"
                  state={userName}
                  setState={setUserName}
                  board="default"
                />
              </Animated.View>
              <Animated.View
                entering={FadeInDown.delay(200).duration(400).springify()}
                className="items-start w-full"
              >
                <PrimaryButton
                  action={handleProceed}
                  // screen="BasicInfo"
                  text={loading ? "Loading..." : "Proceed"}
                />
                <View className="flex flex-row gap-4">
                  <TouchableOpacity
                    className="px-2 py-3 bg-black rounded-2xl"
                    onPress={async () => {
                      await clearToken();
                      await AsyncStorage.removeItem("onboardingState");
                    }}
                  >
                    <Text className="text-white">Delete all token</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="px-2 py-3 bg-black rounded-2xl"
                    onPress={async () => {
                      await logout();
                    }}
                  >
                    <Text className="text-white">Logout</Text>
                  </TouchableOpacity>
                 </View>
              </Animated.View>
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

export default UserInfo;
