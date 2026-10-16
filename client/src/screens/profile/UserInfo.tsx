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
import { LottieLoadingAnimation } from "@/src/constants/LoadingAnimation";
import Animated, {
  FadeInUp,
  FadeInDown,
  BounceIn,
} from "react-native-reanimated";
import React, { FC, useEffect, useState } from "react";
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
import { clearToken } from "@/src/storage/SecureTokens";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/src/auth/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import {
  GetStringDataAsync,
  StoreStringDataAsync,
} from "@/src/storage/ProfileDataAsync";
import { saveDraftSection } from "@/src/storage/profileDraft";

const createProfileAnimation = require("@/src/assets/animations/createProfile.json");

const UserInfo: FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [disabilityStatus, setDisabilityStatus] = useState<boolean>(false);

  const navigation = useNavigation<NavigationProps>();

  useEffect(() => {
    const disablePrimaryButton = () => {
      if (userName.trim() === "") {
        setDisabilityStatus(true);
      } else {
        setDisabilityStatus(false);
      }
    };
    disablePrimaryButton();
  }, [userName]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  const handleProceed = async () => {
    if (userName === "") {
      setError(true);
      setErrorMessage("Username cannot be empty!");
      return;
    }

    try {
      setLoading(true);


      await saveDraftSection("username", userName);
      await saveDraftSection("visible_to_verified_only", verifiedOnly);
      await StoreStringDataAsync("UserProfileStatus", "UserInfoCompleted");
      console.log(
        "Profile screen status after validation: ",
        await GetStringDataAsync("UserProfileStatus"),
      );
      navigation.navigate("BasicInfo");
    } catch (e) {
      console.log("Draft save error: ", e);
      setError(true);
      setErrorMessage("Something went wrong. Try again!");
      setTimeout(() => {
        setError(false);
        setErrorMessage("");
      }, 5000);
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
          <View className="flex-1 w-full items-center justify-center mt-20 p-screen bg-background gap-large pt-extralarge">
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
            <Animated.View
              key={errorMessage}
              entering={BounceIn.delay(200).duration(300)}
              style={{
                paddingTop: error ? 22 : 0,
              }}
            >
              <ErrorText text={`${errorMessage}`} />
            </Animated.View>
            <View className="flex w-full gap-mid items-start">
              <Animated.View
                entering={FadeInUp.delay(200).duration(400).springify()}
                className="items-start w-full"
              >
                <Title text={`Username:`} />
                <InputFields
                  plchldr="eg: neeschal123"
                  state={userName}
                  setState={(text: string) => {
                    const sanitized = text.replace(/[^a-zA-Z0-9._]/g, "");
                    setUserName(sanitized);
                  }}
                  board="default"
                />
              </Animated.View>
              <TouchableOpacity
                onPress={() => setVerifiedOnly((v) => !v)}
                className="flex-row items-center gap-3 mt-2"
                accessibilityRole="radio"
                accessibilityState={{ selected: verifiedOnly }}
              >
                <Ionicons
                  name={verifiedOnly ? "radio-button-on" : "radio-button-off"}
                  size={22}
                  color={verifiedOnly ? "#0066FF" : "#8F8F8F"}
                />
                <View className="flex-1">
                  <SubTitle text="Show your profile to verified members only" />
                </View>
              </TouchableOpacity>
              <Animated.View
                entering={FadeInDown.delay(200).duration(400).springify()}
                className="flex w-full"
              >
                <PrimaryButton
                  action={handleProceed}
                  disability={disabilityStatus}
                  text="Proceed"
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
      {loading && <LottieLoadingAnimation />}
    </SafeAreaView>
  );
};

export default UserInfo;
