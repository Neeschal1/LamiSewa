import {
  View,
  Text,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { FC, useEffect, useState } from "react";
import { LottieLoadingAnimation } from "@/src/constants/LoadingAnimation";
import Animated, {
  FadeInUp,
  FadeInDown,
  BounceIn,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CustomDropdown,
  Description,
  ErrorText,
  InputFields,
  PrimaryButton,
  Title,
} from "@/src/components/systemComponentsLayout";
import { CommunityItems, DietItems } from "@/src/utils/objects";
import { getJsonData, saveJsonData } from "@/src/storage/SecureCredentials";
import { useNavigation } from "expo-router";
import { NavigationProps } from "@/src/components/componentsType";

const AdditionalInfo: FC = () => {
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [disabilityStatus, setDisabilityStatus] = useState<boolean>(false);

  const [religion, setReligion] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");

  const [community, setCommunity] = useState<string | null>(null);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [communityItem, setCommunityItem] = useState(CommunityItems);

  const [diet, setDiet] = useState<string | null>(null);
  const [dietOpen, setDietOpen] = useState(false);
  const [dietItem, setDietItem] = useState(DietItems);

  const navigation = useNavigation<NavigationProps>();

  useEffect(() => {
    const PrimaryButtonState = () => {
      if (
        religion.trim() === "" ||
        height.trim() === "" ||
        weight.trim() === "" ||
        community?.trim() === "" ||
        diet?.trim() === ""
      ) {
        setDisabilityStatus(true);
      } else {
        setDisabilityStatus(false);
      }
    };
    PrimaryButtonState();
  }, []);

  const handleProceed = async () => {
    setError(false);
    setErrorMessage("");
    try {
      setLoading(true);
      const userprofileadditionalinfodata = {
        height: height,
        weight: weight,
        religion: religion,
        diet: diet,
        community: community,
      };
      await saveJsonData("additionalinfo", userprofileadditionalinfodata);

      const fetchuserspersonalinfodata = await getJsonData("additionalinfo");
      console.log("User's additional data: \n", fetchuserspersonalinfodata);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      navigation.navigate("CareerInfo");
    } catch (err) {
      console.log("Error occured!", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      edges={["bottom"]}
      className="bg-background flex flex-1 items-center justify-center"
    >
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={{ flex: 1, marginTop: 20 }}
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
            >
              <ErrorText text={`${errorMessage}`} />
            </Animated.View>
            <Animated.View
              entering={FadeInUp.delay(200).duration(400).springify()}
              className="flex items-center gap-mid"
            >
              <View className="items-start w-full">
                <Title text="Religion:" />
                <InputFields
                  plchldr="eg: Hindu"
                  state={religion}
                  setState={setReligion}
                  board="default"
                />
              </View>
              <Animated.View
                entering={FadeInUp.delay(400).duration(400).springify()}
                className="items-start w-full"
              >
                <Title text="Height:" />
                <InputFields
                  plchldr="eg: 5 ft 5 inch"
                  state={height}
                  setState={setHeight}
                  board="default"
                />
              </Animated.View>
              <Animated.View
                entering={FadeInUp.delay(600).duration(400).springify()}
                className="items-start w-full"
              >
                <Title text="Weight:" />
                <InputFields
                  plchldr="eg: 50kg"
                  state={weight}
                  setState={setWeight}
                  board="default"
                />
              </Animated.View>
              <Animated.View
                entering={FadeInDown.delay(600).duration(400).springify()}
                className="w-full z-4"
              >
                <Title text="Community:" />
                <CustomDropdown
                  open={communityOpen}
                  value={community}
                  items={communityItem}
                  setOpen={setCommunityOpen}
                  setValue={setCommunity}
                  setItems={setCommunityItem}
                />
              </Animated.View>
              <Animated.View
                entering={FadeInDown.delay(400).duration(400).springify()}
                style={{ zIndex: 1000 }}
                className="w-full z-1"
              >
                <Title text="Diet:" />
                <CustomDropdown
                  open={dietOpen}
                  value={diet}
                  items={dietItem}
                  setOpen={setDietOpen}
                  setValue={setDiet}
                  setItems={setDietItem}
                />
              </Animated.View>
            </Animated.View>
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
        entering={FadeInUp.delay(200).duration(400).springify()}
        className="flex items-center w-full"
      >
        <Description text="LamiSewa © 2026. All rights reserved." />
      </Animated.View>
      {loading && <LottieLoadingAnimation />}
    </SafeAreaView>
  );
};

export default AdditionalInfo;
