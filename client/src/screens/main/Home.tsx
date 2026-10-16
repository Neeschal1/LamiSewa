import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  Image,
  ActivityIndicator,
} from "react-native";
import { Gesture, GestureDetector, Directions } from "react-native-gesture-handler";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { BlurView } from "expo-blur";
import ToastManager, { Toast } from "toastify-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
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
import {
  fetchSemanticMatches,
  fetchSubscriptionStatus,
} from "@/src/services/payments/subscription";
import { followUser } from "@/src/services/privacy/follow";

const star = require("@/src/assets/icons/star.png");
const unselect = require("@/src/assets/icons/UnmatchedHeart.png");

const MIN_SCORE = 0.8;

type Card = {
  name: string;
  city: string;
  pic: string;
  hobbies: string[];
  raw: any;
  score?: number;
};

const toCardFromMatch = (m: any): Card => ({
  name: m?.basic_info?.nickname || m?.basic_info?.fullname || m?.username || "Member",
  city: m?.personal_info?.current_city || m?.city || "",
  pic:
    m?.basic_info?.profile_picture ||
    "https://i.pinimg.com/736x/ff/14/a0/ff14a0b3a565567f03f47147f50b64e8.jpg",
  hobbies: Array.isArray(m?.hobbies) ? m.hobbies.slice(0, 5) : [],
  raw: m,
  score: m?.score,
});

const toCardFromDummy = (d: any): Card => ({
  name: d?.basicInfo?.nickname || d?.basicInfo?.fullname || "Member",
  city: d?.personalInfo?.current_city || "",
  pic: d?.basicInfo?.profile_picture || "",
  hobbies: Array.isArray(d?.hobbies) ? d.hobbies.slice(0, 5).map((h: any) => h.hobby) : [],
  raw: d,
});

const Home: FC = () => {
  const [index, setIndex] = useState<number>(0);
  const [nearYou, setNearYou] = useState<boolean>(false);
  const [cards, setCards] = useState<Card[]>(() => DummyUsers.map(toCardFromDummy));
  const [loadingMatches, setLoadingMatches] = useState<boolean>(true);
  const [semanticMode, setSemanticMode] = useState<boolean>(false);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const navigation = useNavigation<NavigationProps>();

  useEffect(() => {
    const load = async () => {
      try {
        const sub = await fetchSubscriptionStatus();
        if (sub?.is_subscribed) {
          try {
            const matches = await fetchSemanticMatches();
            const filtered = Array.isArray(matches)
              ? matches.filter((m: any) => typeof m?.score !== "number" || m.score >= MIN_SCORE)
              : [];
            if (filtered.length > 0) {
              setCards(filtered.map(toCardFromMatch));
              setSemanticMode(true);
              setIndex(0);
              return;
            }
          } catch (e) {
            console.log("Semantic matches unavailable, using suggestions:", e);
          }
        }
        setCards(DummyUsers.map(toCardFromDummy));
        setSemanticMode(false);
      } catch (e) {
        console.log("Subscription check failed, using suggestions:", e);
        setCards(DummyUsers.map(toCardFromDummy));
      } finally {
        setLoadingMatches(false);
      }
    };
    load();
  }, []);

  const card = useMemo(() => cards[index % Math.max(cards.length, 1)], [cards, index]);

  const resetSlide = useCallback(() => {
    translateX.value = withSpring(0, { damping: 20, stiffness: 180 });
    opacity.value = withTiming(1, { duration: 200 });
  }, [translateX, opacity]);

  const handleNextArrow = useCallback(() => {
    if (cards.length === 0) return;
    resetSlide();
    setIndex((i) => (i >= cards.length - 1 ? 0 : i + 1));
  }, [cards.length, resetSlide]);

  const handleBackArrow = () => {
    if (cards.length === 0) return;
    resetSlide();
    setIndex((i) => (i <= 0 ? cards.length - 1 : i - 1));
  };

  const openProfile = useCallback(() => {
    if (!card) return;
    resetSlide();
    navigation.navigate("UserDetails", { profile: card.raw });
  }, [card, navigation, resetSlide]);

  const flingLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(() => runOnJS(openProfile)())
    .runOnJS(true);

  const pan = Gesture.Pan()
    .activeOffsetX([-15, 15])
    .onUpdate((e) => {
      translateX.value = Math.min(0, e.translationX);
      opacity.value = 1 - Math.min(0.35, Math.abs(e.translationX) / 800);
    })
    .onEnd((e) => {
      if (e.translationX < -110 || e.velocityX < -900) {
        translateX.value = withTiming(-420, { duration: 220 }, (done) => {
          if (done) runOnJS(openProfile)();
        });
      } else {
        translateX.value = withSpring(0, { damping: 20, stiffness: 180 });
        opacity.value = withTiming(1, { duration: 200 });
      }
    })
    .runOnJS(true);

  const composed = Gesture.Race(pan, flingLeft);

  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  const handleMatch = async () => {
    if (!card?.raw?.profileid) {
      handleNextArrow();
      return;
    }
    try {
      await followUser(card.raw.profileid);
      Toast.show({
        type: "success",
        text1: `Match request sent to ${card?.name ?? "member"}`,
        position: "center",
        visibilityTime: 3000,
        autoHide: true,
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Could not send request.",
        position: "center",
        visibilityTime: 3000,
        autoHide: true,
      });
    }
    handleNextArrow();
  };

  const Nearyou = () => {
    setNearYou(true);
    navigation.navigate("NearYou");
  };

  const Recommendation = () => {
    setNearYou(false);
  };

  if (loadingMatches || !card) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
      <View className="flex-1 w-full items-center justify-center bg-background">
        <StatusBar translucent hidden={false} />
        <GestureDetector gesture={composed}>
          <Animated.View style={[{ flex: 1, width: "100%" }, slideStyle]}>
          <ImageBackground
            className="flex flex-1 w-full items-center justify-between pt-20"
            source={{ uri: card.pic }}
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
          {semanticMode && typeof card.score === "number" ? (
            <View className="bg-black/60 px-4 py-1 rounded-full mt-2">
              <Text className="font-Poppinsregular text-white text-description">
                {Math.round(card.score * 100)}% match
              </Text>
            </View>
          ) : null}
          <View className="flex items-start w-full p-screen gap-large">
            <TouchableOpacity onPress={openProfile} className="flex items-start w-full">
              <View className="flex items-start">
                <View className="flex flex-row items-center gap-small justify-center">
                  <Ionicons name="location-outline" size={24} color="white" />
                  <SubHeading text={card.city || "Nepal"} />
                </View>
                <Heading text={card.name} />

                <View className="flex w-full flex-wrap flex-row gap-small">
                  {card.hobbies.slice(0, 3).map((h) => (
                    <View
                      key={h}
                      className="bg-black px-4 py-2 rounded-2xl items-center justify-center"
                    >
                      <Describe text={h} />
                    </View>
                  ))}
                  {card.hobbies.length > 3 ? (
                    <TouchableOpacity
                      onPress={openProfile}
                      className="bg-black py-2 px-2 rounded-2xl items-center justify-center"
                    >
                      <Describe text={`More +${card.hobbies.length - 3}`} />
                    </TouchableOpacity>
                  ) : null}
                </View>
                <Text className="font-Poppinsregular text-white/80 text-description mt-2">
                  Swipe left for full profile
                </Text>
              </View>
            </TouchableOpacity>

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
        </Animated.View>
        </GestureDetector>
      </View>
  );
};

export default Home;
