import {
  ImageBackground,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
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

const defaultUserImage = require("@/src/assets/images/user.png");

const FeaturedPhoto = () => {
  const [images, setImages] = useState<(string | null)[]>([null,null,null,null,null,null,]);

  const [error, setError] = useState<boolean | any>(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigation = useNavigation<NavigationProps>();

  const pickAndUpload = async (index: number) => {
    setError(null);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setError("Permission denied");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (result.canceled) return;
    setLoading(true);

    const uri = result.assets[0].uri;
    const url = await UploadImages(uri);

    if (url) {
      setImages((prev) => {
        const updated = [...prev];
        updated[index] = url;
        return updated;
      });
    }

    setLoading(false);
  };

  const handleSave = () => {
    console.log("Images URL: ", images)
  }

  return (
    <View className="bg-background flex p-screen justify-between flex-1">
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
              {loading ? <View key={index}>
                <SubTitle text="Loading..." />
              </View> : <View className="items-center">
                <View className="w-12 h-12 rounded-full bg-white justify-center items-center">
                  <Ionicons name="add" size={28} color="#444" />

                </View>
                <SubTitle text="Add" />
              </View>}
            </ImageBackground>
          )}
        </TouchableOpacity>
      ))}
      </View>
      <View className="flex flex-row w-full justify-between">
        <View className="flex w-[48%]">
          <SecondaryButton action={()=>{navigation.goBack()}} text="Cancel" />
        </View>
        <View className="flex w-[48%]">
          <PrimaryButton action={handleSave} text="Save" />
        </View>
      </View>
    </View>
  );
};

export default FeaturedPhoto;
