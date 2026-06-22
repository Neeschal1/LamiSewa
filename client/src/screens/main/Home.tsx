import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React, { FC, useState } from "react";
import { BlurView } from "expo-blur";
import {
  Description,
  MainScreenName,
  Title,
} from "@/src/components/systemComponentsLayout";
import { DummyUsers } from "@/src/utils/DummyData";
import { Ionicons } from "@expo/vector-icons";

const Home: FC = () => {
  const [index, setIndex] = useState<number>(0);

  const handleNextArrow = () => {
    if (index >= DummyUsers.length - 1) {
      setIndex(0);
    } else {
      setIndex(index + 1);
    }
  };

  const handleBackArrow = () => {
    if (index <= 0) {
      setIndex(DummyUsers.length - 1);
    } else {
      setIndex(index - 1);
    }
  };

  return (
    <View className="flex-1 w-full items-center justify-center bg-background">
      <StatusBar translucent />
      <ImageBackground
        className="flex flex-1 w-full items-center justify-between pt-20"
        source={{ uri: DummyUsers[index].basicInfo.profile_picture }}
      >
        <View className="flex flex-row gap-mid items-center">
          <TouchableOpacity>
            <Text className="font-Poppinsregular text-white text-subheading">
              Recommended
            </Text>
          </TouchableOpacity>
          <Text className="font-Poppinsregular text-white text-subheading">
            |
          </Text>
          <TouchableOpacity>
            <Text className="font-Poppinsregular text-white text-subheading">
              Near you
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex items-start w-full p-screen gap-large">
          <View className="flex items-start">
            <View className="flex flex-row items-center gap-mid justify-center">
              <Ionicons name="location-outline" size={24} color="white" />
              <Text className="font-Poppinssemibold text-background text-subheading">
                {DummyUsers[index].personalInfo.current_city}
              </Text>
            </View>

            <Text className="font-Poppinssemibold text-background text-screenname">
              {DummyUsers[index].basicInfo.nickname}
            </Text>

            <View className="flex w-full flex-wrap flex-row gap-small">
              {DummyUsers[index]["hobbies"].slice(0, 3).map((index) => (
                <View
                  key={index.item}
                  className="bg-black w-[31%] py-2 px-1 rounded-2xl items-center justify-center"
                >
                  <Text className="text-white font-Poppinsregular text-[12px] text-center">
                    {index.hobby}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className="flex flex-row w-full items-center justify-around">
            <BlurView
              experimentalBlurMethod="dimezisBlurView"
              intensity={30}
              tint="dark"
              style={{
                width: 65,
                height: 65,
                borderRadius: 32.5,
                overflow: "hidden",
              }}
            >
              <TouchableOpacity
                onPress={handleBackArrow}
                className="flex-1 items-center justify-center border border-white/30"
              >
                <Ionicons name="arrow-back-outline" size={24} color="white" />
              </TouchableOpacity>
            </BlurView>
            <TouchableOpacity></TouchableOpacity>
            <BlurView
              experimentalBlurMethod="dimezisBlurView"
              intensity={30}
              tint="dark"
              style={{
                width: 65,
                height: 65,
                borderRadius: 32.5,
                overflow: "hidden",
              }}
            >
              <TouchableOpacity
                onPress={handleNextArrow}
                className="h-[65px] w-[65px] backdrop-blur-lg border-white/50 rounded-full items-center justify-center bg-background/5"
              >
                <Ionicons
                  name="arrow-forward-outline"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
            </BlurView>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Home;
