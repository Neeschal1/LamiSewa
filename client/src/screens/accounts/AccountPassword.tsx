import {
  View,
  Text,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  Image,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeInUp,
  FadeInDown,
  BounceIn,
} from "react-native-reanimated";
import {
  Description,
  ErrorText,
  InputPassword,
  MainScreenName,
  PrimaryButton,
  Title,
} from "@/src/components/systemComponentsLayout";
import { useNavigation } from "expo-router";
import { NavigationProps } from "@/src/components/componentsType";

const logo = require("@/src/assets/images/mainLogo.png");

const AccountPassword = () => {
  const [unMatched, setUnMatched] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<string>("");

  const [newpassword, setNewPassword] = useState<string>("");
  const [presentPassword, setPresentPassword] = useState<string>("");
  const [confirmnewPassword, setConfirmNewPassword] = useState<string>("");
  const [seePresentPassword, setSeePresentPassword] = useState<boolean>(false);
  const [seeNewPassword, setSeeNewPassword] = useState<boolean>(false);
  const [seeConfirmNewPassword, setSeeConfirmNewPassword] =
    useState<boolean>(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const navigation = useNavigation<NavigationProps>();

  const handleContinue = () => {
    if (presentPassword === newpassword) {
      setUnMatched(true);
      setShowMessage(
        "Your current password and new password \nmust not match with each other. \nPlease choose a different password to proceed!",
      );
      return;
    }

    if (newpassword != confirmnewPassword) {
      setUnMatched(true);
      setShowMessage(
        "Password and Confirm password didn't matched. Make sure they both matches first!",
      );
      return;
    }

    if (presentPassword != newpassword && newpassword === confirmnewPassword) {
      setShowSuccessModal(true);
    }
  };

  const handleOkay = () => {
    setShowSuccessModal(false);
    navigation.navigate("Profile");
  };

  return (
    <SafeAreaView className="flex flex-1 bg-background">
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 items-center justify-start bg-background p-screen">
            <StatusBar hidden translucent />
            <View className="flex items-start justify-start gap-extralarge">
              <Animated.View
                entering={FadeInUp.delay(200).duration(400).springify()}
              >
                <View>
                  {unMatched ? (
                    <Animated.View
                      key={showMessage}
                      entering={BounceIn.delay(200).duration(300)}
                      className="flex align-start"
                    >
                      <ErrorText text={`${showMessage}`} />
                    </Animated.View>
                  ) : null}
                </View>
              </Animated.View>
            </View>
            <View className="flex gap-mid justify-start">
              <Animated.View
                entering={FadeInUp.delay(400).duration(400).springify()}
                className="items-start w-full"
              >
                <Title text="Present Password" />
                <InputPassword
                  plchldr="***********"
                  state={presentPassword}
                  setState={setPresentPassword}
                  board="default"
                  visibility={seePresentPassword}
                  setVisibility={setSeePresentPassword}
                />
              </Animated.View>
              <Animated.View
                entering={FadeInUp.delay(400).duration(400).springify()}
                className="items-start w-full"
              >
                <Title text="New Password" />
                <InputPassword
                  plchldr="***********"
                  state={newpassword}
                  setState={setNewPassword}
                  board="default"
                  visibility={seeNewPassword}
                  setVisibility={setSeeNewPassword}
                />
              </Animated.View>
              <Animated.View
                entering={FadeInDown.delay(400).duration(400).springify()}
                className="items-start w-full"
              >
                <Title text="Confirm New Password" />
                <InputPassword
                  plchldr="***********"
                  state={confirmnewPassword}
                  setState={setConfirmNewPassword}
                  board="default"
                  visibility={seeConfirmNewPassword}
                  setVisibility={setSeeConfirmNewPassword}
                />
              </Animated.View>
              <Animated.View
                entering={FadeInDown.delay(200).duration(400).springify()}
              >
                <PrimaryButton action={handleContinue} text="Continue" />
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
                        <Description text="Your Password has been Changed Successfully" />
                      </View>
                    </View>
                  </View>
                  <PrimaryButton
                    text="Okay :)"
                    action={handleOkay}
                    screen="BasicInfo"
                  />
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AccountPassword;
