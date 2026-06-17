import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
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
} from "@/src/components/systemComponentsLayout";
import { SafeAreaView } from "react-native-safe-area-context";
import Checkbox from "expo-checkbox";
import CountryPicker, { CountryCode } from "react-native-country-picker-modal";

const facebookLogo = require("@/src/assets/images/facebook.png");
const googleLogo = require("@/src/assets/images/google.png");

const Signup = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [country, setCountry] = useState({
    cca2: "NP" as CountryCode,
    callingCode: ["977"],
  });
  const [phone, setPhone] = useState<string>("");
  const [checkFilledState, setCheckFilledState] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<string>("");
  const [isSelected, setIsSelection] = useState(false);

  const handleButtonPress = () => {
    if (name === "" || email === "" || phone === "") {
      setCheckFilledState(true);
      setShowMessage("Fill up all the credentials first!");
    } else if (isSelected === false) {
      setCheckFilledState(true);
      setShowMessage("Oops! You forgot to mark the checkbox");
    } else {
      setCheckFilledState(false);
      const mobile = country["callingCode"][0] + "" + phone;
      const phoneNumber = Number(mobile);
      console.log(
        "\nName: ",
        name,
        "\nEmail: ",
        email,
        "\nPhone Number: ",
        phoneNumber,
        "\nisChecked?: ",
        isSelected,
      );
    }
  };

  return (
    <SafeAreaView className="flex flex-1 bg-background">
      <View className="flex-1 bg-background w-full items-start p-screen justify-center gap-extralarge">
        <View className="flex gap-large">
          <View className="flex items-start">
            <MainScreenName text="Signup" />
            <View className="mt-[-10px]">
              <Description text="New to LamiSewa? Create a new account." />
            </View>
          </View>

          <View className="flex items-start gap-mid">
            <View className="flex items-start w-full">
              <Title text="Full Name" />
              <InputFields
                plchldr="eg: Neeschal Pokharel"
                state={name}
                setState={setName}
                board="default"
              />
            </View>
            <View className="items-start w-full">
              <Title text="Email" />
              <InputFields
                plchldr="eg: example@gmail.com"
                state={email}
                setState={setEmail}
                board="email-address"
              />
            </View>
            <View className="items-start w-full">
              <Title text="Phone Number" />

              <View className="flex-row items-start border-gray-300 rounded-xl">
                <View className="flex-row border p-4 rounded-xl justify-center border-[#CBCBCB] items-center align-center">
                  <CountryPicker
                    countryCode={country.cca2}
                    withCallingCode
                    withFlag
                    withFilter
                    onSelect={(c) => setCountry(c)}
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
              <View className="flex-row items-center w-11/12 gap-5 mt-small">
                <Checkbox
                  value={isSelected}
                  onValueChange={setIsSelection}
                  color={isSelected ? "#FC404E" : "#CBCBCB"}
                />
                <Description text="I agree to the Terms & Conditions and Privacy Policy of LamiSewa." />
              </View>
            </View>
            <View className="flex w-full">
              <View className="ml-[-10px] flex items-center text-center justify-center w-full">
                {checkFilledState ? <ErrorText text={showMessage} /> : null}
              </View>
            </View>
          </View>
        </View>
        <PrimaryButton
          action={handleButtonPress}
          text="Proceed"
          screen="SignupVerification"
        />

        <View className="flex w-full items-center justify-center gap-mid">
          <View className="flex items-center justify-center flex-row gap-2">
            <View
              style={{ height: 1, width: "40%", backgroundColor: "black" }}
            />
            <Description text="OR" />
            <View
              style={{ height: 1, width: "40%", backgroundColor: "black" }}
            />
          </View>
          <View className="flex gap-small">
            <View className="flex gap-mid">
              <SocialButton
                text="Continue with Facebook"
                btnname="facebook"
                logo={facebookLogo}
              />
              <SocialButton
                text="Continue with Google"
                btnname="google"
                logo={googleLogo}
              />
            </View>
            <View className="flex flex-row gap-2 justify-center items-center">
              <SubTitle text="New to LamiSewa?" />
              <TextualButton text="Signup" screen="Signup" />
            </View>
          </View>
          <View className="flex items-center w-full">
            <Description text="Bihebari © 2026. All rights reserved." />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Signup;
