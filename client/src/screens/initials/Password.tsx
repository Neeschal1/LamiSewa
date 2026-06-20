import {
  View,
  StatusBar,
  Modal,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
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

const logo = require("@/src/assets/images/mainLogo.png");

const Password = () => {
  const [password, setPassword] = useState<string>("");
  const [seePassword, setSeePassword] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [seeConfirmPassword, setSeeConfirmPassword] = useState<boolean>(false);

  const [unMatched, setUnMatched] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<string>("");

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleOkay = () => {
    setShowSuccessModal(false);
  };

  const handleContinue = () => {
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
    } else {
      setUnMatched(false);
      setShowMessage("");
      setShowSuccessModal(true);
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
            <StatusBar hidden translucent />
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
                        <Description text="Your Account has been Created Successfully" />
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

export default Password;
