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
import UserBasicService from "@/src/services/profile/basicinfo";
import { StoreStringDataAsync } from "@/src/storage/ProfileDataAsync";
import axios from "axios";

const defaultUserImage = require("@/src/assets/images/user.png");
const defaultUserCoverPicture =
  "https://res-console.cloudinary.com/dlzx671ck/thumbnails/v1/image/upload/v1783946328/NjNlNTdhMGIwY2MyZGYyNDhmMWFkNWUzMTc3M2RiZWRfcWEyd3ls/drilldown";

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
  };

  const handleProcees = async () => {
    setError(false);
    setErrorMessage("");
    try {
      setLoading(true);
      const fetchusersbasicinfodata = await getJsonData("basicinfo");
      console.log("User's data: ", fetchusersbasicinfodata);

      const fullName = fetchusersbasicinfodata["fullname"];
      const gender = fetchusersbasicinfodata["gender"];
      const handlingProfile = fetchusersbasicinfodata["profile_handler"];

      const year = fetchusersbasicinfodata["date_of_birth"]["year"];
      const month = fetchusersbasicinfodata["date_of_birth"]["month"];
      const day = fetchusersbasicinfodata["date_of_birth"]["day"];
      const datevalue = fetchusersbasicinfodata["date_of_birth"]["value"];

      const dob = `${year}-${month}-${day}`;

      await UserBasicService(
        fullName,
        nickName,
        bio,
        imageUrl,
        defaultUserCoverPicture,
        handlingProfile,
        gender,
        dob,
      );

      await StoreStringDataAsync("UserProfileStatus", "BasicInfoCompleted");
      navigation.navigate("PersonalInfo");
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
              key={errorMessage}
              entering={BounceIn.delay(200).duration(300)}
              style={{
                paddingTop: error ? 22 : 0,
              }}
            >
              <ErrorText text={`${errorMessage}`} />
            </Animated.View>
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
