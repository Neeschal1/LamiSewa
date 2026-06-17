import { View, StatusBar } from "react-native";
import React, { useState } from "react";
import {
  Description,
  MainScreenName,
  PrimaryButton,
  Title,
  ErrorText,
  InputPassword,
} from "@/src/components/systemComponentsLayout";

const Password = () => {
  const [password, setPassword] = useState<string>("");
  const [seePassword, setSeePassword] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [seeConfirmPassword, setSeeConfirmPassword] = useState<boolean>(false);

  const [unMatched, setUnMatched] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<string>("");

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
      console.log("Successfully set up the password!")
    }
  };

  return (
    <View className="flex-1 items-start justify-center bg-background p-screen pt-[-10px]">
      <StatusBar hidden translucent />
      <View className="flex items-start justify-center gap-extralarge">
        <View>
          <MainScreenName text="Password" />
          <View className="mt-[-10px]">
            {unMatched ? (
              <View className="flex align-start">
              <ErrorText text={`${showMessage}`} />
            </View>
            ) : <Description text="Choose a stronger password to stay secure." />}
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
    </View>
  );
};

export default Password;
