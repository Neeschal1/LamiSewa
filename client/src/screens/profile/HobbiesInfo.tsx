import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { FC, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ErrorText,
  Title,
  SubTitle,
  PrimaryButton,
  Description,
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

const HobbiesInfo: FC = () => {
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [hobbies, setHobbies] = useState<string[]>([]);

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
    if (hobbies.length != 5){
      setError(true);
      setErrorMessage("You must select any 5 hobbies in order to proceed!");
      return;
    }
  }

  return (
    <SafeAreaView className="bg-background flex flex-1">
      <StatusBar hidden translucent />
      <View className="flex items-center">
        <Title text="Hobbies (5/6)" />
        <ErrorText text={`${error ? errorMessage : ""}`} />
      </View>
      <View className="flex items-center">
        <SubTitle text={`Selected: ${hobbies.length}/5`} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-1 items-center justify-start p-screen bg-background gap-large">
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
      <View className="flex items-center mb-1 gap-mid">
        <PrimaryButton screen="LastVerification" action={handleProceed} text="Proceed" />
        <Description text="Bihebari © 2026. All rights reserved." />
      </View>
    </SafeAreaView>
  );
};

export default HobbiesInfo;
