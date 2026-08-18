import {
  View,
  StatusBar,
  Modal,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { LottieLoadingAnimation } from "@/src/constants/LoadingAnimation";
import { Ionicons } from "@expo/vector-icons";
import { jwtDecode } from "jwt-decode";
import Animated, {
  FadeInUp,
  FadeInDown,
  BounceIn,
} from "react-native-reanimated";
import {
  Description,
  MainScreenName,
  PrimaryButton,
  Title,
  ErrorText,
  InputPassword,
} from "@/src/components/systemComponentsLayout";
import { SafeAreaView } from "react-native-safe-area-context";
import HandleSignupService from "@/src/services/accounts/signup";
import { getData } from "@/src/storage/SecureCredentials";
import axios from "axios";
import {
  DeleteStringDataAsync,
  StoreStringDataAsync,
} from "@/src/storage/ProfileDataAsync";
import { useAuth } from "@/src/auth/AuthContext";
import { useNavigation } from "expo-router";
import { NavigationProps } from "@/src/components/componentsType";
import {
  getAccessTokens,
  saveRefreshTokens,
  saveTokens,
} from "@/src/storage/SecureTokens";
import Records from "@/src/services/payments/Records";

const logo = require("@/src/assets/images/mainLogo.png");

const Password = () => {
  const { login } = useAuth();

  const [password, setPassword] = useState<string>("");
  const [seePassword, setSeePassword] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [seeConfirmPassword, setSeeConfirmPassword] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrormessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [notVerified, setNotVerified] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [disabilityStatus, setDisabilityStatus] = useState<boolean>(false);
  const navigation = useNavigation<NavigationProps>();

  type AccessTokenPayload = {
    user_id: number;
    exp: number;
    iat: number;
    token_type: string;
  };

  const accessTokenRef = useRef<string | null>(null);

  useEffect(() => {
    const disabledPrimaryButton = () => {
      if (password.trim() === "" || confirmPassword.trim() === "") {
        setDisabilityStatus(true);
      } else {
        setDisabilityStatus(false);
      }
    };
    disabledPrimaryButton();
  }, [password, confirmPassword]);

  const handleOkay = async () => {
    if (notVerified) {
      navigation.navigate("Signup");
      setShowSuccessModal(false);
      return;
    }

    await StoreStringDataAsync("profilestatus", "incomplete");
    if (accessTokenRef.current) {
      await login(accessTokenRef.current);
    }
    setShowSuccessModal(false);
  };

  const handleContinue = async () => {
    const pass = password.trim();
    const confirmpass = confirmPassword.trim();

    if (pass.length < 8) {
      setError(true);
      setErrormessage("Password must be at least 8 characters long!");
      setTimeout(() => {
        setError(false);
        setErrormessage("");
      }, 5000);
      return;
    } else if (pass != confirmpass) {
      setError(true);
      setErrormessage(
        "Your password and confirm password doesn't \nmatch. Please check them again and try again!",
      );
      setTimeout(() => {
        setError(false);
        setErrormessage("");
      }, 5000);
      return;
    }

    try {
      setLoading(true);
      const data = await getData();
      const email = data["email"];
      const name = data["fullname"];
      const phoneNumber = data["contactnumber"];
      const response = await HandleSignupService(
        name,
        email,
        phoneNumber,
        password,
      );
      if (response.status === 201) {
        setError(false);
        setLoading(false);
        setErrormessage("");
        setShowSuccessModal(true);
        console.log("Response from server: ", response["data"]);
        const accessToken =
          response["data"]["Message"]["Tokens"]["accesstoken"];
        const refreshToken =
          response["data"]["Message"]["Tokens"]["refreshtoken"];
        const userprofilestatus =
          response["data"]["Message"]["UserprofileStatus"];
        await saveTokens(accessToken);
        await saveRefreshTokens(refreshToken);
        const decoded = jwtDecode<AccessTokenPayload>(accessToken);
        accessTokenRef.current = accessToken;
        console.log("\n\n\nReady to go to records!\n")
        await Records()
        console.log("\nAfter records!\n\n\n")
        if (userprofilestatus === true) {
          await StoreStringDataAsync("ProfileScreenStatus", "NoProfileExists");
        } else {
          await DeleteStringDataAsync("ProfileScreenStatus");
        }
        console.log("\nDecoded Users id: ", decoded.user_id);
        console.log("\nDecoded expiry date: ", decoded.exp);
        console.log("\nDecoded token type: ", decoded.token_type);
      }
    } catch (e) {
      console.log("Error occured: ", e);
      if (axios.isAxiosError(e)) {
        const status = e.response?.status;
        const response = e.response?.data;
        console.log("Error Status: ", status);
        console.log("Error Response: ", response);
        if (status === 401) {
          setNotVerified(true);
          setShowSuccessModal(true);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-background items-center justify-center flex flex-1">
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        className="flex-1 flex items-center justify-end"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 items-center justify-center bg-background p-screen">
            <StatusBar hidden={false} translucent />
            <View className="flex w-full items-start justify-center gap-extralarge">
              <Animated.View
                entering={FadeInUp.delay(200).duration(400).springify()}
              >
                <MainScreenName text="Password" />
                <View className="mt-[-10px]">
                  {error ? (
                    <Animated.View
                      key={errorMessage}
                      entering={BounceIn.delay(200).duration(300)}
                      className="flex align-start"
                    >
                      <ErrorText text={`${errorMessage}`} />
                    </Animated.View>
                  ) : (
                    <Description text="Choose a stronger password to stay secure." />
                  )}
                </View>
              </Animated.View>
              <View className="flex gap-mid">
                <Animated.View
                  entering={FadeInUp.delay(400).duration(400).springify()}
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
                <Animated.View
                  entering={FadeInDown.delay(400).duration(400).springify()}
                  className="items-start w-full"
                >
                  <Title text="Confirm Password" />
                  <InputPassword
                    plchldr="***********"
                    state={confirmPassword}
                    setState={setConfirmPassword}
                    board="default"
                    visibility={seeConfirmPassword}
                    setVisibility={setSeeConfirmPassword}
                  />
                </Animated.View>
              </View>
              <Animated.View
                className="flex w-full"
                entering={FadeInDown.delay(200).duration(400).springify()}
              >
                <PrimaryButton
                  action={handleContinue}
                  text="Sign up"
                  disability={disabilityStatus}
                />
              </Animated.View>
            </View>
            <Modal
              visible={showSuccessModal}
              transparent
              animationType="fade"
              statusBarTranslucent
            >
              <View
                className="flex-1 items-center justify-center"
                style={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  padding: 10,
                }}
              >
                <View className="bg-white py-4 mx-screen rounded-3xl w-full p-screen items-center gap-large">
                  {notVerified ? (
                    <View className="flex items-center gap-8">
                      <Ionicons name="sad-outline" size={32} color="#FF000E" />
                      <View className="mt-[-30px] w-full flex items-center">
                        <MainScreenName text="Timeout" />
                        <View className="mt-[-10px] w-full items-center">
                          <Description text="You exceeded the time to choose a password. Signup your credentials again to continue!" />
                        </View>
                      </View>
                      <PrimaryButton
                        text="Take me to Signup Screen"
                        action={handleOkay}
                      />
                    </View>
                  ) : (
                    <View className="flex w-full items-center gap-mid">
                      <Image className="h-40 w-40" source={logo} />
                      <View className="mt-[-30px] w-full flex items-center">
                        <MainScreenName text="Success!" />
                        <View className="mt-[-10px]">
                          <Description text="Your Account has been Created Successfully" />
                        </View>
                      </View>
                      <View className="flex w-full">
                        <PrimaryButton text="Okay :)" action={handleOkay} />
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </Modal>
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

export default Password;
