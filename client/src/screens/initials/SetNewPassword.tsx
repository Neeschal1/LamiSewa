import {
  View,
  Text,
  StatusBar,
  Modal,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Animated, {
  FadeInUp,
  FadeInDown,
  BounceIn,
} from "react-native-reanimated";
import {
  Description,
  InputFields,
  MainScreenName,
  PrimaryButton,
  Title,
  ErrorText,
  SocialButton,
  SubTitle,
  TextualButton,
  InputPassword,
} from "@/src/components/systemComponentsLayout";
import { SafeAreaView } from "react-native-safe-area-context";
import HandleResetPasswordService from "@/src/services/accounts/resetpassword";
import { getDataString } from "@/src/storage/Ids";
import axios from "axios";

const logo = require("@/src/assets/images/mainLogo.png");

const SetNewPassword = () => {
  const [password, setPassword] = useState<string>("");
  const [seePassword, setSeePassword] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [seeConfirmPassword, setSeeConfirmPassword] = useState<boolean>(false);

  const [unMatched, setUnMatched] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<string>("");

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleContinue = async () => {
    const pass = password.trim();
    const confirmpass = confirmPassword.trim();

    const userid = Number(await getDataString());
    console.log("Users ID: ", userid)

    if (!pass || !confirmpass) {
      setUnMatched(true);
      setShowMessage("Please fill in both password fields.");
      return;
    }

    if (pass.length < 8) {
      setUnMatched(true);
      setShowMessage("Password must be at least 8 characters long!");
      return;
    }

    if (pass != confirmpass) {
      setUnMatched(true);
      setShowMessage(
        "Your password and confirm password doesn't \nmatch. Please check them again and try again!",
      );
      return;
    }

    try {
      const userid = Number(await getDataString());
      const reset = await HandleResetPasswordService(userid, password);
      if (reset.status === 200) {
        setUnMatched(false);
        setShowMessage("");
        setShowSuccessModal(true);
      }
    } catch (e) {
      if(axios.isAxiosError(e)){
        const data = e.response?.data
        const status = e.response?.status
        console.log("Status from reset password: ", status)
        console.log("\Data from reset password: ", data)
        if (status === 400){
          setUnMatched(true);
          setShowMessage(data);
        }
        if (status === 404){
          setUnMatched(true);
          setShowMessage(data);
        }
        if (status === 417){
          setUnMatched(true);
          setShowMessage(data);
        }
      }
    }
  };

  const handleOkay = () => {
    setShowSuccessModal(false);
  };

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
          <View className="flex-1 items-start justify-center bg-background p-screen pt-[-10px]">
            <StatusBar hidden={false} translucent />
            <View className="flex items-center justify-center gap-extralarge">
              <View>
                <MainScreenName text="Set a New Password" />
                <View className="mt-[-10px]">
                  {unMatched ? (
                    <View className="flex align-center">
                      <ErrorText text={`${showMessage}`} />
                    </View>
                  ) : (
                    <Description text="Choose a stronger password to stay secure." />
                  )}
                </View>
              </View>
              <View className="flex gap-mid">
                <View className="items-start w-full">
                  <Title text="Password" />
                  <InputPassword
                    plchldr="***********"
                    state={password}
                    setState={setPassword}
                    board="default"
                    visibility={seePassword}
                    setVisibility={setSeePassword}
                  />
                </View>
                <View className="items-start w-full">
                  <Title text="Confirm Password" />
                  <InputPassword
                    plchldr="***********"
                    state={confirmPassword}
                    setState={setConfirmPassword}
                    board="default"
                    visibility={seeConfirmPassword}
                    setVisibility={setSeeConfirmPassword}
                  />
                </View>
              </View>
              <PrimaryButton action={handleContinue} text="Continue" />
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
                        <Description text="Your password has been successfully reset" />
                      </View>
                    </View>
                  </View>
                  <PrimaryButton
                    text="Okay :)"
                    action={handleOkay}
                    screen="Login"
                  />
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
    </SafeAreaView>
  );
};

export default SetNewPassword;
