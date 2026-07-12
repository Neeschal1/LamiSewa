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
import { LottieLoadingAnimation } from "@/src/constants/LoadingAnimation";
import Animated, {
  FadeInUp,
  FadeInDown,
  BounceIn,
} from "react-native-reanimated";
import UploadImages from "@/src/utils/uploadImages";
import {
  Description,
  ErrorText,
  Title,
  PrimaryButton,
  InputFields,
} from "@/src/components/systemComponentsLayout";
import { SafeAreaView } from "react-native-safe-area-context";
import { getJsonData, saveJsonData } from "@/src/storage/SecureCredentials";
import { useNavigation } from "expo-router";
import { NavigationProps } from "@/src/components/componentsType";

const defaultUserImage = require("@/src/assets/images/user.png");

const CasualInfo = () => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [disabilityStatus, setDisabilityStatus] = useState<boolean>(false);

  const [error, setError] = useState<string | null | boolean>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [nickName, setNickName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [bioError, setBioError] = useState<string>("");

  const navigation = useNavigation<NavigationProps>();

  useEffect(() => {
    const BioLength = () => {
      setBioError(`Current Length: ${bio.length}`);
    };
    BioLength();
  }, [bio]);

  useEffect(() => {
    const disablePrimaryButton = () => {
      if (
        nickName.trim() === "" ||
        bio.trim() === "" ||
        imageUrl.trim() == ""
      ) {
        setDisabilityStatus(true);
      } else {
        setDisabilityStatus(false);
      }
    };
    disablePrimaryButton();
  }, [nickName, bio]);

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

      const url = await UploadImages(uri);

      if (url) {
        setImageUrl(url);
        console.log("Image URL: ", url);
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

  const handleProcees = async () => {
    setError(false);
    setErrorMessage("");
    try {
      setLoading(true)
      const userprofilebasicinfodata = {
        nickname: nickName,
        profile_picture: imageUrl,
        bio: bio,
      };
      await saveJsonData("casualinfo", userprofilebasicinfodata);

      const fetchusersbasicinfodata = await getJsonData("casualinfo");
      console.log("User's data: ", fetchusersbasicinfodata);

      await new Promise(resolve => setTimeout(resolve, 2000));

      navigation.navigate("PersonalInfo");
    } catch (err) {
      console.log("Error: ", err);
    } finally {
      setLoading(false);
    }
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
        style={{ flex: 1, marginTop: 40 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 items-center justify-center p-screen bg-background gap-large">
            <StatusBar hidden={false} translucent />
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
                  {error ? (
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
                disability={disabilityStatus}
              />
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Animated.View
        entering={FadeInDown.delay(200).duration(300)}
        className="flex items-center w-full"
      >
        <Description text="LamiSewa © 2026. All rights reserved." />
      </Animated.View>
      {loading && <LottieLoadingAnimation />}
    </SafeAreaView>
  );
};

export default CasualInfo;
