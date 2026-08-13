import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
} from "react-native";
import React, { FC, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LottieLoadingAnimation } from "@/src/constants/LoadingAnimation";
import {
  ErrorText,
  Title,
  SubTitle,
  PrimaryButton,
  Description,
  MainScreenName,
  SecondaryButton,
} from "@/src/components/systemComponentsLayout";
import {
  CreativeHobbies,
  FoodAndLifestyleHobbies,
  FunAndEntertainmentHobbies,
  LearningAndIntellectualHobbies,
  MusicAndArtsHobbies,
  SocialAndCommunityHobbies,
  SportsAndFitnessHobbies,
  TechnologyHobbies,
  TravelAndAdventureHobbies,
} from "@/src/utils/objects";
import { useAuth } from "@/src/auth/AuthContext";
import { clearToken } from "@/src/storage/SecureTokens";
import axios from "axios";
import UserHobbiesService from "@/src/services/profile/hobbies";
import { DeleteStringDataAsync, StoreStringDataAsync } from "@/src/storage/ProfileDataAsync";

const logo = require("@/src/assets/images/mainLogo.png");

const HobbiesInfo: FC = () => {
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [disabilityStatus, setDisabilityStatus] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false)

  useEffect(()=>{
    const handlePrimaryButton = () => {
      if (hobbies.length != 5){
        setDisabilityStatus(true)
      } else {
        setDisabilityStatus(false)
      }
    }
    handlePrimaryButton()
  }, [hobbies])

  const toggleHobby = (option: string) => {
    if (hobbies.includes(option)) {
      setHobbies(hobbies.filter((item) => item !== option));
      return;
    }
    if (hobbies.length >= 5) {
      setError(true);
      setErrorMessage("You can select a maximum of 5 hobbies.");
      return;
    }

    setError(false);
    setErrorMessage("");
    setHobbies([...hobbies, option]);
  };

  const handleProceed = () => {
    setShowSuccessModal(true);
    return;
  };

  const { setProfileCompleted } = useAuth();

  const handleOkay = async () => {
    setError(false);
    setErrorMessage("");
    try {
      setLoading(true);
      await UserHobbiesService(hobbies[0], hobbies[1], hobbies[2], hobbies[3], hobbies[4]);
      await DeleteStringDataAsync("UserProfileStatus");
      await StoreStringDataAsync("ProfileScreenStatus", "AllCompleted");
      await StoreStringDataAsync("SubscriptionStatusAfterBuildingUpProfile", "Incomplete");
      setProfileCompleted(true);
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
      <StatusBar hidden={false} translucent />
      <View className="items-center mt-20 justify-center py-3">
        <SubTitle text={`What are your hobbies? ${hobbies.length}/5`} />
        {error ? <ErrorText text={`${errorMessage} `} /> : null}
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-1 items-center justify-center p-screen bg-background gap-large">
          <View className="flex w-full">
            <Title text="Creative:" />
            <View className="flex-row flex-wrap gap-3 mt-2">
              {CreativeHobbies.map((item) => (
                <TouchableOpacity
                  key={item.index}
                  onPress={() => toggleHobby(item.option)}
                  className={`px-7 py-3 rounded-2xl border ${
                    hobbies.includes(item.option)
                      ? "bg-primaryblue border-primaryblue"
                      : "bg-background border-gray-300"
                  }`}
                >
                  <Text
                    className={`font-Poppinsmedium ${
                      hobbies.includes(item.option)
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    {item.option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View className="flex w-full">
            <Title text="Food and Lifestyle:" />
            <View className="flex-row flex-wrap gap-3 mt-2">
              {FoodAndLifestyleHobbies.map((item) => (
                <TouchableOpacity
                  key={item.index}
                  onPress={() => toggleHobby(item.option)}
                  className={`px-7 py-3 rounded-2xl border ${
                    hobbies.includes(item.option)
                      ? "bg-primaryblue border-primaryblue"
                      : "bg-background border-gray-300"
                  }`}
                >
                  <Text
                    className={`font-Poppinsmedium ${
                      hobbies.includes(item.option)
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    {item.option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View className="flex w-full">
            <Title text="Music:" />
            <View className="flex-row flex-wrap gap-3 mt-2">
              {MusicAndArtsHobbies.map((item) => (
                <TouchableOpacity
                  key={item.index}
                  onPress={() => toggleHobby(item.option)}
                  className={`px-7 py-3 rounded-2xl border ${
                    hobbies.includes(item.option)
                      ? "bg-primaryblue border-primaryblue"
                      : "bg-background border-gray-300"
                  }`}
                >
                  <Text
                    className={`font-Poppinsmedium ${
                      hobbies.includes(item.option)
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    {item.option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View className="flex w-full">
            <Title text="Sports and Fitness:" />
            <View className="flex-row flex-wrap gap-3 mt-2">
              {SportsAndFitnessHobbies.map((item) => (
                <TouchableOpacity
                  key={item.index}
                  onPress={() => toggleHobby(item.option)}
                  className={`px-7 py-3 rounded-2xl border ${
                    hobbies.includes(item.option)
                      ? "bg-primaryblue border-primaryblue"
                      : "bg-background border-gray-300"
                  }`}
                >
                  <Text
                    className={`font-Poppinsmedium ${
                      hobbies.includes(item.option)
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    {item.option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View className="flex w-full">
            <Title text="Travel and Adventure:" />
            <View className="flex-row flex-wrap gap-3 mt-2">
              {TravelAndAdventureHobbies.map((item) => (
                <TouchableOpacity
                  key={item.index}
                  onPress={() => toggleHobby(item.option)}
                  className={`px-7 py-3 rounded-2xl border ${
                    hobbies.includes(item.option)
                      ? "bg-primaryblue border-primaryblue"
                      : "bg-background border-gray-300"
                  }`}
                >
                  <Text
                    className={`font-Poppinsmedium ${
                      hobbies.includes(item.option)
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    {item.option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View className="flex w-full">
            <Title text="Tech Enthusiastics:" />
            <View className="flex-row flex-wrap gap-3 mt-2">
              {TechnologyHobbies.map((item) => (
                <TouchableOpacity
                  key={item.index}
                  onPress={() => toggleHobby(item.option)}
                  className={`px-7 py-3 rounded-2xl border ${
                    hobbies.includes(item.option)
                      ? "bg-primaryblue border-primaryblue"
                      : "bg-background border-gray-300"
                  }`}
                >
                  <Text
                    className={`font-Poppinsmedium ${
                      hobbies.includes(item.option)
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    {item.option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View className="flex w-full">
            <Title text="Learnings:" />
            <View className="flex-row flex-wrap gap-3 mt-2">
              {LearningAndIntellectualHobbies.map((item) => (
                <TouchableOpacity
                  key={item.index}
                  onPress={() => toggleHobby(item.option)}
                  className={`px-7 py-3 rounded-2xl border ${
                    hobbies.includes(item.option)
                      ? "bg-primaryblue border-primaryblue"
                      : "bg-background border-gray-300"
                  }`}
                >
                  <Text
                    className={`font-Poppinsmedium ${
                      hobbies.includes(item.option)
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    {item.option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View className="flex w-full">
            <Title text="Social and Communities:" />
            <View className="flex-row flex-wrap gap-3 mt-2">
              {SocialAndCommunityHobbies.map((item) => (
                <TouchableOpacity
                  key={item.index}
                  onPress={() => toggleHobby(item.option)}
                  className={`px-7 py-3 rounded-2xl border ${
                    hobbies.includes(item.option)
                      ? "bg-primaryblue border-primaryblue"
                      : "bg-background border-gray-300"
                  }`}
                >
                  <Text
                    className={`font-Poppinsmedium ${
                      hobbies.includes(item.option)
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    {item.option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View className="flex w-full">
            <Title text="Others:" />
            <View className="flex-row flex-wrap gap-3 mt-2">
              {FunAndEntertainmentHobbies.map((item) => (
                <TouchableOpacity
                  key={item.index}
                  onPress={() => toggleHobby(item.option)}
                  className={`px-7 py-3 rounded-2xl border ${
                    hobbies.includes(item.option)
                      ? "bg-primaryblue border-primaryblue"
                      : "bg-background border-gray-300"
                  }`}
                >
                  <Text
                    className={`font-Poppinsmedium ${
                      hobbies.includes(item.option)
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    {item.option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      <View className="flex w-full items-center mb-1 gap-mid">
        <View className="flex w-full p-screen">
          <PrimaryButton disability={disabilityStatus} action={handleProceed} text="Proceed" />
        </View>
        <Description text="LamiSewa © 2026. All rights reserved." />
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
                <MainScreenName text="Are you sure?!" />
                <View className="mt-[-10px]">
                  <Description text="By proceeding, you confirm that all the information provided is true. If any false or misleading information found, you agree to take full responsibility and prepare to face any legal consequences that may arrise. However, you can update your detail from your profile option. Are you sure to continue?" />
                </View>
              </View>
            </View>
            <View className="flex flex-col w-full gap-mid">
              <PrimaryButton
                text="Okay :)"
                action={handleOkay}
              />
              <SecondaryButton
                action={() => {
                  setShowSuccessModal(false);
                }}
                text="Cancel"
              />
            </View>
          </View>
          {loading && <LottieLoadingAnimation />}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HobbiesInfo;
