import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import React, { FC, useState } from "react";
import { BlurView } from "expo-blur";
import ToastManager, { Toast } from "toastify-react-native";
import {
  Heading,
  SubHeading,
  Describe,
  toastConfig,
} from "@/src/components/systemComponentsLayout";
import { DummyUsers } from "@/src/utils/DummyData";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { NavigationProps } from "@/src/components/componentsType";

const star = require("@/src/assets/icons/star.png");
const unselect = require("@/src/assets/icons/UnmatchedHeart.png");

const Home: FC = () => {
  const [index, setIndex] = useState<number>(0);
  const [nearYou, setNearYou] = useState<boolean>(false);

  const navigation = useNavigation<NavigationProps>();

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

  const handleMatch = () => {
    const name = DummyUsers[index].basicInfo.nickname;

    Toast.show({
      type: "success",
      text1: `Match request sent to ${name}`,
      position: "center",
      visibilityTime: 3000,
      autoHide: true,
    });
    handleNextArrow();
  };

  const Nearyou = () => {
    setNearYou(true);
    navigation.navigate("NearYou");
  };

  const Recommendation = () => {
    setNearYou(false);
  };

  return (
      <View className="flex-1 w-full items-center justify-center bg-background">
        <StatusBar translucent hidden={false} />
        <ImageBackground
          className="flex flex-1 w-full items-center justify-between pt-20"
          source={{ uri: DummyUsers[index].basicInfo.profile_picture }}
        >
          <View className="flex flex-row gap-mid items-center">
            <TouchableOpacity onPress={Recommendation}>
              <Text
                className={`font-Poppinsregular ${nearYou ? "text-darkvariant" : "text-background"} ${nearYou ? "text-description" : "text-subheading"}`}
              >
                Recommended
              </Text>
            </TouchableOpacity>
            <Text className="font-Poppinsregular text-white text-subheading">
              |
            </Text>
            <TouchableOpacity onPress={Nearyou}>
              <Text
                className={`font-Poppinsregular ${nearYou ? "text-background" : "text-darkvariant"} ${nearYou ? "text-subheading" : "text-description"}`}
              >
                Near you
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex items-start w-full p-screen gap-large">
            <View className="flex items-start">
              <View className="flex flex-row items-center gap-small justify-center">
                <Ionicons name="location-outline" size={24} color="white" />
                <SubHeading
                  text={DummyUsers[index].personalInfo.current_city}
                />
              </View>
              <Heading text={DummyUsers[index].basicInfo.nickname} />

              <View className="flex w-full flex-wrap flex-row gap-small">
                {DummyUsers[index]["hobbies"].slice(0, 3).map((index) => (
                  <View
                    key={index.item}
                    className="bg-black w-[25%] py-2 rounded-2xl items-center justify-center"
                  >
                    <Describe text={index.hobby} />
                  </View>
                ))}
                <TouchableOpacity className="bg-black py-2 px-2 rounded-2xl items-center justify-center">
                  <Describe text="More +2" />
                </TouchableOpacity>
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
                  borderRadius: 35,
                  overflow: "hidden",
                }}
              >
                <TouchableOpacity
                  onPress={handleBackArrow}
                  className="h-[65px] w-[65px] backdrop-blur-lg border-white/50 rounded-full items-center justify-center bg-background/5"
                >
                  <Ionicons name="arrow-back-outline" size={24} color="white" />
                </TouchableOpacity>
              </BlurView>
              <TouchableOpacity onPress={handleMatch}>
                <ImageBackground
                  className="flex w-[102px] h-[95px] items-center pt-3 justify-center"
                  source={star}
                >
                  <Image source={unselect} />
                </ImageBackground>
              </TouchableOpacity>
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
            <ToastManager config={toastConfig} />
          </View>
        </ImageBackground>
      </View>
  );
};

export default Home;
