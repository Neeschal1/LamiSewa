import {
  View,
  Text,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { FC, useEffect, useState } from "react";
import Animated, {
  FadeInUp,
  FadeInDown,
  BounceIn,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { LottieLoadingAnimation } from "@/src/constants/LoadingAnimation";
import {
  CustomDropdown,
  Description,
  ErrorText,
  InputFields,
  PrimaryButton,
  Title,
} from "@/src/components/systemComponentsLayout";
import { DegreeItems, WorkingItems } from "@/src/utils/objects";
import { getJsonData, saveJsonData } from "@/src/storage/SecureCredentials";
import { useNavigation } from "expo-router";
import { NavigationProps } from "@/src/components/componentsType";
import UserCareerService from "@/src/services/profile/careerinfo";
import axios from "axios";
import { StoreStringDataAsync } from "@/src/storage/ProfileDataAsync";

const CareerInfo: FC = () => {
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [disabilityStatus, setDisabilityStatus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [degree, setDegree] = useState<string>("");
  const [degreeOpen, setDegreeOpen] = useState(false);
  const [degreeItem, setDegreeItem] = useState(DegreeItems);

  const [working, setWorking] = useState<string>("");
  const [workingOpen, setWorkingOpen] = useState(false);
  const [workingItem, setWorkingItem] = useState(WorkingItems);

  const [college, setCollege] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [profession, setProfession] = useState<string>("");

  const navigation = useNavigation<NavigationProps>();

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    const PrimaryButtonState = () => {
      if (!degree || !working || !college || !profession || !companyName) {
        setDisabilityStatus(true);
      } else {
        setDisabilityStatus(false);
      }
    };
    PrimaryButtonState();
  }, [degree, working, college, profession, companyName]);

  const handleProceed = async () => {
    setError(false);
    setErrorMessage("");
    try {
      setLoading(true);
      await UserCareerService(
        degree,
        college,
        working,
        profession,
        companyName,
      );
      await StoreStringDataAsync("UserProfileStatus", "CareerInfoCompleted");
      navigation.navigate("HobbiesInfo");
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
          "Something went wrong. Maybe your \ninternet connection is not stable!",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-background flex flex-1">
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 flex items-center justify-center p-screen bg-background gap-large">
            <StatusBar hidden translucent />
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
                className="w-full z-4"
              >
                <Title text="Education:" />
                <Title text="Highest Qualification:" />
                <CustomDropdown
                  open={degreeOpen}
                  value={degree}
                  items={degreeItem}
                  setOpen={setDegreeOpen}
                  setValue={setDegree}
                  setItems={setDegreeItem}
                />
              </Animated.View>
              <Animated.View
                entering={FadeInUp.delay(400).duration(400).springify()}
                className="items-start w-full"
              >
                <Title text="College Name:" />
                <InputFields
                  plchldr="eg: Butwal Multiple Campus"
                  state={college}
                  setState={setCollege}
                  board="default"
                />
              </Animated.View>
              <Animated.View
                entering={FadeInUp.delay(600).duration(400).springify()}
                className="w-full mt-mid"
              >
                <Title text="Profession:" />
                <Title text="Currently Working in:" />
                <CustomDropdown
                  open={workingOpen}
                  value={working}
                  items={workingItem}
                  setOpen={setWorkingOpen}
                  setValue={setWorking}
                  setItems={setWorkingItem}
                />
              </Animated.View>
              <Animated.View
                entering={FadeInDown.delay(600).duration(400).springify()}
                className="items-start w-full"
              >
                <Title text="Working Place (Office Name):" />
                <InputFields
                  plchldr="eg: Meta"
                  state={companyName}
                  setState={setCompanyName}
                  board="default"
                />
              </Animated.View>
              <Animated.View
                entering={FadeInDown.delay(400).duration(400).springify()}
                className="items-start w-full"
              >
                <Title text="Working as:" />
                <InputFields
                  plchldr="eg: Software Engineer"
                  state={profession}
                  setState={setProfession}
                  board="default"
                />
              </Animated.View>
            </View>
            <Animated.View
              entering={FadeInDown.delay(300).duration(400).springify()}
            >
              <PrimaryButton
                disability={disabilityStatus}
                action={handleProceed}
                text="Proceed"
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

export default CareerInfo;
