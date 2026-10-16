import {
  ImageBackground,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import {
  PrimaryButton,
  SecondaryButton,
  SubTitle,
} from "@/src/components/systemComponentsLayout";
import UploadImages from "@/src/utils/uploadImages";
import { useNavigation } from "expo-router";
import { NavigationProps } from "@/src/components/componentsType";
import { fetchFeaturedPhotos, saveFeaturedPhotos } from "@/src/services/profile/featuredPhotos";
import axios from "axios";

const defaultUserImage = require("@/src/assets/images/user.png");

const FeaturedPhoto = () => {
  const [images, setImages] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const [error, setError] = useState<boolean | any>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigation = useNavigation<NavigationProps>();

  useEffect(() => {
    const prefill = async () => {
      try {
        const existing = await fetchFeaturedPhotos();
        if (existing.length > 0) {
          setImages((prev) =>
            prev.map((_, i) => existing[i]?.image_url ?? null)
          );
        }
      } catch {}
    };
    prefill();
  }, []);

  const pickAndUpload = async (index: number) => {
    setError(false);
    setErrorMessage("");
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setError(true);
      setErrorMessage("Gallery permission denied.");
      return;
    }

    let result;
    try {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.8,
      });
    } catch {
      setError(true);
      setErrorMessage("Could not open gallery. Try again.");
      return;
    }

    if (result.canceled) return;
    setLoading(true);

    try {
      const uri = result.assets[0].uri;
      const url = await UploadImages(uri);

      if (url) {
        setImages((prev) => {
          const updated = [...prev];
          updated[index] = url;
          return updated;
        });
      } else {
        setError(true);
        setErrorMessage("Upload failed. Check your connection and try again.");
      }
    } catch {
      setError(true);
      setErrorMessage("Upload failed. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const validImages = images.filter(
      (image): image is string => image !== null,
    );
    if (validImages.length === 0) {
      setError(true);
      setErrorMessage("Add at least one photo before saving.");
      return;
    }

    try{
      setLoading(true)
      const saved = await saveFeaturedPhotos(validImages);
      if (Array.isArray(saved) && saved.length > 0) {
        navigation.goBack()
      } else {
        setError(true);
        setErrorMessage("Saved, but the server returned no photos. Restart the server, then pull down on your profile to refresh.");
      }
      setLoading(false)
    } catch (err) {
      if(axios.isAxiosError(err)){
        const status = err.response?.status;
        const response = err.response?.data;
        console.log("Status: ", status, "\nData: ", response)
        setError(true);
        setErrorMessage(typeof response?.message === "string" ? response.message : "Could not save photos. Check connection and server, then try again.");
      } else {
        setError(true);
        setErrorMessage("Could not save photos. Try again.");
      }
      setLoading(false)
    } finally {
      setLoading(false)
    }
  };

  return (
    <View className="bg-background flex p-screen justify-between flex-1">
      {error ? (
        <Text className="font-Poppinsregular text-primaryred text-center pb-2">
          {errorMessage || "Something went wrong."}
        </Text>
      ) : null}
      <View className="flex flex-1 flex-wrap flex-row justify-between">
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => pickAndUpload(index)}
            activeOpacity={0.8}
            className="w-[31%] aspect-[3/4] rounded-2xl overflow-hidden bg-[#ECEBFF] border border-[#D9D9D9] mb-4"
          >
            {image ? (
              <ImageBackground
                source={{ uri: image }}
                className="flex-1"
                resizeMode="cover"
              />
            ) : (
              <ImageBackground
                source={defaultUserImage}
                className="flex-1 justify-center items-center"
                resizeMode="cover"
                imageStyle={{ opacity: 0.25 }}
              >
                {loading ? (
                  <View key={index}>
                    <SubTitle text="Loading..." />
                  </View>
                ) : (
                  <View className="items-center">
                    <View className="w-12 h-12 rounded-full bg-white justify-center items-center">
                      <Ionicons name="add" size={28} color="#444" />
                    </View>
                    <SubTitle text="Add" />
                  </View>
                )}
              </ImageBackground>
            )}
          </TouchableOpacity>
        ))}
      </View>
      <View className="flex flex-row w-full justify-between">
        <View className="flex w-[48%]">
          <SecondaryButton
            action={() => {
              navigation.goBack();
            }}
            text="Cancel"
          />
        </View>
        <View className="flex w-[48%]">
          <PrimaryButton action={handleSave} text="Save" />
        </View>
      </View>
    </View>
  );
};

export default FeaturedPhoto;
