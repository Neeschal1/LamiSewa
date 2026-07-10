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
import React, { useRef, useState } from "react";
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
import { getData, saveDataString } from "@/src/storage/Ids";
import axios from "axios";
import { StoreStringDataAsync } from "@/src/storage/ProfileData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/src/auth/AuthContext";

const logo = require("@/src/assets/images/mainLogo.png");

const Password = () => {
  const { login } = useAuth();

  const [password, setPassword] = useState<string>("");
  const [seePassword, setSeePassword] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [seeConfirmPassword, setSeeConfirmPassword] = useState<boolean>(false);

  const [unMatched, setUnMatched] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // const [access, setAccess] = useState<string>("");
  const accessTokenRef = useRef<string | null>(null);

  const handleOkay = async () => {
    await AsyncStorage.setItem("profilestatus", "incomplete");
    if (accessTokenRef.current) {
      await login(accessTokenRef.current);
    }
    setShowSuccessModal(false);
  };

  const handleContinue = async () => {
    const pass = password.trim();
    const confirmpass = confirmPassword.trim();

    if (!pass || !confirmpass) {
      setUnMatched(true);
      setShowMessage("Please fill in both password fields.");
      return;
    } else if (pass.length < 8) {
      setUnMatched(true);
      setShowMessage("Password must be at least 8 characters long!");
      return;
    } else if (pass != confirmpass) {
      setUnMatched(true);
      setShowMessage(
        "Your password and confirm password doesn't \nmatch. Please check them again and try again!",
      );
      return;
    }
    try {
      setLoading(true);
      const data = await getData();
      const email = data["email"];
      const name = data["fullname"];
      const phoneNumber = data["phonenumber"];
      const response = await HandleSignupService(
        name,
        email,
        phoneNumber,
        password,
      );
      if (response.status === 201) {
        setUnMatched(false);
        setLoading(false);
        setShowMessage("");
        setShowSuccessModal(true);
        accessTokenRef.current = response.accessToken;
      }
    } catch (e) {
      console.log("Error occured: ", e);
      if (axios.isAxiosError(e)) {
        const status = e.response?.status;
        const response = e.response?.data;
        console.log("Error Status: ", status);
        console.log("Error Response: ", response);
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
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 items-center justify-center bg-background p-screen">
            <StatusBar hidden={false} translucent />
            <View className="flex items-start justify-center gap-extralarge">
              <Animated.View
                entering={FadeInUp.delay(200).duration(400).springify()}
              >
                <MainScreenName text="Password" />
                <View className="mt-[-10px]">
                  {unMatched ? (
                    <Animated.View
                      key={showMessage}
                      entering={BounceIn.delay(200).duration(300)}
                      className="flex align-start"
                    >
                      <ErrorText text={`${showMessage}`} />
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
                entering={FadeInDown.delay(200).duration(400).springify()}
              >
                <PrimaryButton
                  action={handleContinue}
                  text={loading ? "Loading..." : "Continue"}
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
                  <View className="flex items-center">
                    <Image className="h-40 w-40" source={logo} />
                    <View className="mt-[-30px] w-full flex items-center">
                      <MainScreenName text="Success!" />
                      <View className="mt-[-10px]">
                        <Description text="Your Account has been Created Successfully" />
                      </View>
                    </View>
                  </View>
                  <PrimaryButton
                    text="Okay :)"
                    action={handleOkay}
                  />
                </View>
              </View>
            </Modal>
          </View>
          <Animated.View
            entering={FadeInDown.delay(200).duration(400).springify()}
            className="flex items-center w-full"
          >
            <Description text="LamiSewa © 2026. All rights reserved." />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Password;
