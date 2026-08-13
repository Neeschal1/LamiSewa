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
import {
  CommunityItems,
  DietItems,
  HeightItems,
  ReligionItems,
  WeightItems,
} from "@/src/utils/objects";
import { useNavigation } from "expo-router";
import { NavigationProps } from "@/src/components/componentsType";
import UserAdditionalService from "@/src/services/profile/additionalinfo";
import { StoreStringDataAsync } from "@/src/storage/ProfileDataAsync";
import axios from "axios";

const AdditionalInfo: FC = () => {
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [disabilityStatus, setDisabilityStatus] = useState<boolean>(false);

  const [community, setCommunity] = useState<string>("");
  const [communityOpen, setCommunityOpen] = useState(false);
  const [communityItem, setCommunityItem] = useState(CommunityItems);

  const [height, setHeight] = useState<string>("");
  const [heightOpen, setHeightOpen] = useState(false);
  const [heightItem, setHeightItem] = useState(HeightItems);

  const [weight, setWeight] = useState<string>("");
  const [weightOpen, setWeightOpen] = useState(false);
  const [weightItem, setWeightItem] = useState(WeightItems);

  const [religion, setReligion] = useState<string>("");
  const [religionOpen, setReligionOpen] = useState(false);
  const [religionItem, setReligionItem] = useState(ReligionItems);

  const [diet, setDiet] = useState<string>("");
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
  }, [religion, height, weight, community, diet]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  const handleProceed = async () => {
    setError(false);
    setErrorMessage("");
    try {
      setLoading(true);
      await UserAdditionalService(height, weight, religion, diet, community);
      await StoreStringDataAsync(
        "UserProfileStatus",
        "AdditionalInfoCompleted",
      );
      navigation.navigate("CareerInfo");
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
              style={{
                paddingTop: error ? 22 : 0,
              }}
            >
              <ErrorText text={`${errorMessage}`} />
            </Animated.View>
            <Animated.View
              entering={FadeInUp.delay(200).duration(400).springify()}
              className="flex items-center gap-mid"
            >
              <Animated.View
                entering={FadeInDown.delay(400).duration(400).springify()}
                style={{ zIndex: 1000 }}
                className="w-full z-1"
              >
                <Title text="Religion:" />
                <CustomDropdown
                  open={religionOpen}
                  value={religion}
                  items={religionItem}
                  setOpen={setReligionOpen}
                  setValue={setReligion}
                  setItems={setReligionItem}
                />
              </Animated.View>
              <Animated.View
                entering={FadeInDown.delay(400).duration(400).springify()}
                style={{ zIndex: 1000 }}
                className="w-full z-1"
              >
                <Title text="Height:" />
                <CustomDropdown
                  open={heightOpen}
                  value={height}
                  items={heightItem}
                  setOpen={setHeightOpen}
                  setValue={setHeight}
                  setItems={setHeightItem}
                />
              </Animated.View>
              <Animated.View
                entering={FadeInDown.delay(400).duration(400).springify()}
                style={{ zIndex: 1000 }}
                className="w-full z-1"
              >
                <Title text="Weight:" />
                <CustomDropdown
                  open={weightOpen}
                  value={weight}
                  items={weightItem}
                  setOpen={setWeightOpen}
                  setValue={setWeight}
                  setItems={setWeightItem}
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
              className="flex w-full"
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
