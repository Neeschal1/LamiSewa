import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Animated, {
  FadeInUp,
  FadeInDown,
  BounceIn,
} from "react-native-reanimated";
import ProfilePicture from "@/src/utils/profilePicture";
import {
  Description,
  ErrorText,
  Title,
  PrimaryButton,
  InputFields,
} from "@/src/components/systemComponentsLayout";
import { SafeAreaView } from "react-native-safe-area-context";

const defaultUserImage = require("@/src/assets/images/user.png");

const CasualInfo = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null | boolean>(null);

  const [issue, setIssue] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [nickName, setNickName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [bioError, setBioError] = useState<string>("");

  useEffect(() => {
    const BioLength = () => {
      setBioError(`Current Length: ${bio.length}`);
    };
    BioLength();
  }, [bio]);

  const pickAndUpload = async () => {
    setError(null);

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setError("Permission to access media library is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setLocalUri(uri);
      setLoading(true);

      const url = await ProfilePicture(uri);

      if (url) {
        setImageUrl(url);
      } else {
        setError("Upload failed. Please try again.");
      }
      setLoading(false);
    }
    console.log(
      "\n\nImage URL to store in database: ",
      imageUrl,
      "Local URL: ",
      localUri,
    );
  };

  const handleProcees = () => {
    if (!nickName || !bio || !imageUrl || bio.length > 40) {
      setIssue(true);
      setErrorMessage("Please fill up all the details first!");
      return;
    }
    setIssue(false);
    setErrorMessage("");
  };

  const imageSource = imageUrl
    ? { uri: imageUrl }
    : localUri
      ? { uri: localUri }
      : defaultUserImage;

  return (
    <SafeAreaView edges={["bottom"]} className="bg-background flex flex-1">
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
          <View className="flex-1 items-center justify-center p-screen bg-background gap-large">
            <StatusBar hidden translucent />
            <Animated.View
              entering={FadeInUp.delay(200).duration(300)}
              className="flex items-center gap-mid"
            >
              <TouchableOpacity
                onPress={pickAndUpload}
                disabled={loading}
                className="w-[110px] h-[110px] rounded-full relative"
              >
                <Image
                  source={imageSource}
                  className="w-[110px] h-[110px] rounded-full"
                />

                {loading && (
                  <View className="absolute inset-0 bg-black/40 rounded-full items-center justify-center">
                    <ActivityIndicator size="small" color="#fff" />
                  </View>
                )}
              </TouchableOpacity>

              {imageUrl && !loading ? (
                <View className="flex w-full items-center justify-center">
                  <Text className="font-Poppinsmedium text-primaryblue">
                    Image uploaded successfully :)
                  </Text>
                  <Description text="Tap on above icon in order to select your image" />
                </View>
              ) : (
                <View className="flex w-full items-center justify-center">
                  <Title text="Select Image" />
                  {issue ? (
                    <Animated.View
                      key={errorMessage}
                      entering={BounceIn.delay(200).duration(300)}
                    >
                      <ErrorText text={`${errorMessage}`} />
                    </Animated.View>
                  ) : (
                    <Description text="Tap on above icon in order to select your image" />
                  )}
                </View>
              )}
            </Animated.View>
            <View className="flex gap-mid items-start">
              <Animated.View
                entering={FadeInUp.delay(400).duration(300)}
                className="items-start w-full"
              >
                <Title text="Nick Name:" />
                <InputFields
                  plchldr="eg: Daari Bro"
                  state={nickName}
                  setState={setNickName}
                  board="default"
                />
              </Animated.View>
              <Animated.View
                entering={FadeInDown.delay(400).duration(300)}
                className="flex gap-mid items-start"
              >
                <View className="items-start w-full">
                  <Title text="Bio:" />
                  {bio.length > 40 ? (
                    <View>
                      <ErrorText text="Bio length should be less than 40!" />
                      <ErrorText text={bioError} />
                    </View>
                  ) : null}
                  <InputFields
                    plchldr="eg: Building Products That Matters!"
                    state={bio}
                    setState={setBio}
                    board="default"
                  />
                </View>
              </Animated.View>
            </View>
            <Animated.View entering={FadeInDown.delay(200).duration(300)}>
              <PrimaryButton
                action={handleProcees}
                text="Proceed"
                screen="PersonalInfo"
              />
            </Animated.View>
          </View>
        </ScrollView>
        <Animated.View
              entering={FadeInDown.delay(200).duration(300)} className="flex items-center w-full">
          <Description text="LamiSewa © 2026. All rights reserved." />
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CasualInfo;
