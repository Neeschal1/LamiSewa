import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import ProfilePicture from "@/src/utils/profilePicture";
import DropdownPicker from "react-native-dropdown-picker";
import {
  Description,
  ErrorText,
  InputFields,
  SubTitle,
  Title,
  DOBInput,
  PrimaryButton,
  CustomDropdown,
} from "@/src/components/systemComponentsLayout";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CalendarItems,
  GenderOption,
  ProfileOptions,
} from "@/src/utils/objects";

const defaultUserImage = require("@/src/assets/images/user.png");

const BasicInfo = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState<string>("");
  const [idOption, setIdOption] = useState<string>("");

  const [gender, setGender] = useState<string>("");

  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<"AD" | "BS">("AD");
  const [items, setItems] = useState(CalendarItems);

  const [date, setDate] = useState({
    day: "",
    month: "",
    year: "",
  });

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
    if (
      !name.trim() ||
      !date.day ||
      !date.month ||
      !date.year ||
      !idOption ||
      !gender
    ) {
      setError("Please fill up all the details!");
      return;
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
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 items-center justify-start p-screen bg-background gap-large">
            <StatusBar hidden translucent />
            <View className="flex items-center gap-mid">
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
                    <ErrorText text={`${error}`} />
                  ) : (
                    <Description text="Tap on above icon in order to select your image" />
                  )}
                </View>
              )}
            </View>
            <View className="flex gap-mid items-start">
              <View className="items-start w-full">
                <Title text="Full Name:" />
                <InputFields
                  plchldr="eg: Neeschal Pokharel"
                  state={name}
                  setState={setName}
                  board="default"
                />
              </View>

              <View className="items-start w-full">
                <Title text="Date of Birth:" />
                <View className="flex-row items-center w-full gap-3 mt-2">
                  <View className="flex-1">
                    <DOBInput dob={date} setDob={setDate} />
                  </View>
                  <View style={{ width: 110 }}>
                    <CustomDropdown
                      open={open}
                      value={value}
                      items={items}
                      setOpen={setOpen}
                      setValue={setValue}
                      setItems={setItems}
                    />
                  </View>
                </View>
              </View>

              <View className="items-start w-full">
                <Title text="Let’s make Profile for:" />
                <View className="flex-row flex-wrap gap-3 mt-2">
                  {ProfileOptions.map((item) => (
                    <TouchableOpacity
                      key={item.index}
                      onPress={() => setIdOption(item.option)}
                      className={`px-7 py-3 rounded-2xl border ${
                        idOption === item.option
                          ? "bg-primaryblue border-primaryblue"
                          : "bg-background border-gray-300"
                      }`}
                    >
                      <Text
                        className={`font-Poppinsmedium ${
                          idOption === item.option ? "text-white" : "text-black"
                        }`}
                      >
                        {item.option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View className="items-start w-full">
                <Title text="Gender:" />
                <View className="flex-row flex-wrap gap-3 mt-2">
                  {GenderOption.map((item) => (
                    <TouchableOpacity
                      key={item.index}
                      onPress={() => setGender(item.option)}
                      className={`px-6 py-3 rounded-2xl border ${
                        gender === item.option
                          ? "bg-primaryblue border-primaryblue"
                          : "bg-background border-gray-300"
                      }`}
                    >
                      <Text
                        className={`font-Poppinsmedium ${
                          gender === item.option ? "text-white" : "text-black"
                        }`}
                      >
                        {item.option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <View className="flex w-full items-center gap-mid bg-background mt-2">
          <PrimaryButton
            action={handleProcees}
            text="Proceed"
            screen="PersonalInfo"
          />
          <View className="flex items-center w-full">
            <Description text="LamiSewa © 2026. All rights reserved." />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default BasicInfo;
