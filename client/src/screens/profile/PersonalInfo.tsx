import {
  View,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { FC, useEffect, useState } from "react";
import { LottieLoadingAnimation } from "@/src/constants/LoadingAnimation";
import {
  InputFields,
  Title,
  CustomDropdown,
  PrimaryButton,
  ErrorText,
  Description,
} from "@/src/components/systemComponentsLayout";
import Animated, {
  FadeInUp,
  FadeInDown,
  BounceIn,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  GotraItems,
  MaritalStatusItems,
  ResidencyStatusItems,
} from "@/src/utils/objects";
import { getJsonData, saveJsonData } from "@/src/storage/SecureCredentials";
import { useNavigation } from "expo-router";
import { NavigationProps } from "@/src/components/componentsType";
import UserPersonalService from "@/src/services/profile/personalinfo";
import { StoreStringDataAsync } from "@/src/storage/ProfileDataAsync";
import axios from "axios";

const PersonalInfo: FC = () => {
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [disabilityStatus, setDisabilityStatus] = useState<boolean>(false);

  const [livingCountry, setLivingCountry] = useState<string>("");
  const [district, setDistrict] = useState<string>("");

  const [gotra, setGotra] = useState<string>("");
  const [gotraOption, setGotraOption] = useState(false);
  const [gotraItems, setGotraItems] = useState(GotraItems);

  const [maritalStatus, setMaritalStatus] = useState<string>("");
  const [maritalStatusOpen, setMaritalStatusOpen] = useState(false);
  const [maritalStatusItems, setMaritalStatusItems] =
    useState(MaritalStatusItems);

  const [residencyStatus, setResidencyStatus] = useState<string>("");
  const [residencyStatusOpen, setResidencyStatusOpen] = useState(false);
  const [residencyStatusItems, setResidencyStatusItems] =
    useState(ResidencyStatusItems);

  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<NavigationProps>();

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    const disablePrimaryButton = () => {
      if (
        livingCountry.trim() === "" ||
        district.trim() === "" ||
        maritalStatus?.trim() === "" ||
        gotra?.trim() === "" ||
        residencyStatus?.trim() === ""
      ) {
        setDisabilityStatus(true);
      } else {
        setDisabilityStatus(false);
      }
    };
    disablePrimaryButton();
  }, [livingCountry, district, maritalStatus, gotra, residencyStatus]);

  const handleProceed = async () => {
    setError(false);
    setErrorMessage("");
    try {
      setLoading(true);
      await UserPersonalService(
        maritalStatus,
        gotra,
        livingCountry,
        district,
        residencyStatus,
      );
      await StoreStringDataAsync("UserProfileStatus", "PersonalInfoCompleted");
      navigation.navigate("AdditionalInfo");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const statuscode = err?.response?.status;
        const errormessage = err?.response?.data;
        console.log("Status code: ", statuscode);
        console.log("Errormessage: ", errormessage);
        if (statuscode === 400) {
          setError(true);
          setErrorMessage(errormessage);
        }
        if (statuscode === 417) {
          setError(true);
          setErrorMessage("Something went wrong. Try again!");
        }
        setError(true);
        setErrorMessage(
          "Something went wrong. Maybe your internet connection is not stable!",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-background flex flex-1 ">
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
          <View className="flex-1 items-center justify-center p-screen bg-background gap-large pt-extralarge">
            <StatusBar hidden={false} translucent />
            <Animated.View
              key={errorMessage}
              entering={BounceIn.delay(200).duration(300)}
              style={{
                paddingTop: error ? 22 : 0,
              }}
            >
              <ErrorText text={`${errorMessage}`} />
            </Animated.View>
            <View className="flex items-center gap-mid">
              <Animated.View
                entering={FadeInUp.delay(200).duration(400).springify()}
                className="items-start w-full"
              >
                <Title text="Current living country:" />
                <InputFields
                  plchldr="eg: Nepal"
                  state={livingCountry}
                  setState={setLivingCountry}
                  board="default"
                />
              </Animated.View>
              <Animated.View
                entering={FadeInUp.delay(400).duration(400).springify()}
                className="items-start w-full"
              >
                <Title text="District/City:" />
                <InputFields
                  plchldr="eg: Kathmandu"
                  state={district}
                  setState={setDistrict}
                  board="default"
                />
              </Animated.View>
              <Animated.View
                entering={FadeInUp.delay(600).duration(400).springify()}
                className="w-full"
              >
                <Title text="Marital Status" />
                <CustomDropdown
                  open={maritalStatusOpen}
                  value={maritalStatus}
                  items={maritalStatusItems}
                  setOpen={setMaritalStatusOpen}
                  setValue={setMaritalStatus}
                  setItems={setMaritalStatusItems}
                />
              </Animated.View>
              <Animated.View
                entering={FadeInDown.delay(600).duration(400).springify()}
                className="w-full"
              >
                <Title text="Gotra" />
                <CustomDropdown
                  open={gotraOption}
                  value={gotra}
                  items={gotraItems}
                  setOpen={setGotraOption}
                  setValue={setGotra}
                  setItems={setGotraItems}
                />
              </Animated.View>
              <Animated.View
                entering={FadeInDown.delay(400).duration(400).springify()}
                className="w-full"
              >
                <Title text="Residency Status" />

                <CustomDropdown
                  open={residencyStatusOpen}
                  value={residencyStatus}
                  items={residencyStatusItems}
                  setOpen={setResidencyStatusOpen}
                  setValue={setResidencyStatus}
                  setItems={setResidencyStatusItems}
                />
              </Animated.View>
            </View>
            <Animated.View
              entering={FadeInDown.delay(300).duration(400).springify()}
            >
              <PrimaryButton
                action={handleProceed}
                text="Proceed"
                disability={disabilityStatus}
              />
            </Animated.View>
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

export default PersonalInfo;
