import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeInUp,
  FadeInDown,
  BounceIn,
} from "react-native-reanimated";
import {
  CalendarItems,
  GenderOption,
  ProfileOptions,
  RelativeItems,
} from "@/src/utils/objects";
import { LottieLoadingAnimation } from "@/src/constants/LoadingAnimation";
import {
  CustomDropdown,
  Description,
  DOBInput,
  ErrorText,
  InputFields,
  PrimaryButton,
  Title,
} from "@/src/components/systemComponentsLayout";
import { useAuth } from "@/src/auth/AuthContext";
import { clearToken } from "@/src/storage/SecureTokens";
import { DeleteStringDataAsync } from "@/src/storage/ProfileDataAsync";
import {
  deleteData,
  deleteJsonData,
  getData,
  getJsonData,
  saveData,
  saveJsonData,
} from "@/src/storage/SecureCredentials";
import { useNavigation } from "expo-router";
import { NavigationProps } from "@/src/components/componentsType";

const BasicInfo = () => {
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [disabilityStatus, setDisabilityStatus] = useState<boolean>(false);

  const [name, setName] = useState<string>("");

  const [relation, setRelation] = useState<string | null>(null);
  const [relationOpen, setRelationOpen] = useState(false);
  const [relationItem, setRelationItem] = useState(RelativeItems);

  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<"AD" | "BS">("AD");
  const [items, setItems] = useState(CalendarItems);

  const [idOption, setIdOption] = useState<string>("");
  const [gender, setGender] = useState<string>("");

  const [date, setDate] = useState({
    day: "",
    month: "",
    year: "",
  });

  const navigation = useNavigation<NavigationProps>();

  useEffect(() => {
    const disablePrimaryButton = () => {
      if (
        name.trim() === "" ||
        gender.trim() === "" ||
        date["day"].trim() === "" ||
        date["month"].trim() === "" ||
        date["year"].trim() === "" ||
        value.trim() === "" ||
        idOption.trim() === ""
      ) {
        setDisabilityStatus(true);
      } else {
        setDisabilityStatus(false);
      }
    };
    disablePrimaryButton();
  }, [name, gender, date]);

  const { logout } = useAuth();

  const handleProcees = async () => {
    setError(false);
    setErrorMessage("");
    await deleteData();
    await deleteJsonData("basicinfo");
    const fetchuserinfodata = await getData();
    console.log("User's data: ", fetchuserinfodata);
    try {
      setLoading(true);
      const userprofilebasicinfodata = {
        fullname: name,
        profile_handler: idOption,
        gender: gender,
        date_of_birth: date,
        datevalue: value,
      };
      await saveJsonData("basicinfo", userprofilebasicinfodata);

      const fetchusersbasicinfodata = await getJsonData("basicinfo");
      console.log("User's data: ", fetchusersbasicinfodata);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      navigation.navigate("CasualInfo");
    } catch (err) {
      console.log("Error: ", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogOut = async () => {
    await logout();
    await clearToken();
    // await DeleteStringDataAsync("onboardingState");
    // await DeleteStringDataAsync("UserInfoScreenStatus");
  };

  return (
    <SafeAreaView className="bg-background flex flex-1">
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={{ flex: 1, height: "100%" }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 flex items-center justify-center p-screen bg-background gap-large">
            <StatusBar hidden translucent />
            <Animated.View
              key={errorMessage}
              entering={BounceIn.delay(200).duration(300)}
              style={{
                paddingTop: error ? 22 : 0,
              }}
            >
              <ErrorText text={`${errorMessage}`} />
            </Animated.View>
            <View className="flex gap-mid items-start">
              <Animated.View
                entering={FadeInUp.delay(200).duration(400).springify()}
                className="items-start w-full"
              >
                <Title text={`Full Name:`} />
                <InputFields
                  plchldr="eg: Neeschal Pokharel"
                  state={name}
                  setState={setName}
                  board="default"
                />
              </Animated.View>

              <View className="items-start w-full">
                <Title text={`Who are you of ${name}?:`} />
                <Animated.View
                  entering={FadeInUp.delay(400).duration(400).springify()}
                  className="flex-row flex-wrap gap-3 mt-2"
                >
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
                </Animated.View>
              </View>

              {idOption == "Others" ? (
                <View className="items-start w-full">
                  <View className="w-full mt-mid">
                    <Title text={`Mention your identity for ${name}:`} />
                    <CustomDropdown
                      open={relationOpen}
                      value={relation}
                      items={relationItem}
                      setOpen={setRelationOpen}
                      setValue={setRelation}
                      setItems={setRelationItem}
                    />
                  </View>
                </View>
              ) : null}

              <Animated.View
                entering={FadeInUp.delay(600).duration(400).springify()}
                className="items-start w-full"
              >
                <Title text={`${name}'s Date of Birth (in AD):`} />
                <View className="flex-row items-center w-full gap-3 mt-2">
                  <View className="flex-1">
                    <DOBInput dob={date} setDob={setDate} />
                  </View>
                  {/* <View style={{ width: 110 }}>
                    <CustomDropdown
                      open={open}
                      value={value}
                      items={items}
                      setOpen={setOpen}
                      setValue={setValue}
                      setItems={setItems}
                    />
                  </View> */}
                </View>
              </Animated.View>

              <Animated.View
                entering={FadeInDown.delay(600).duration(400).springify()}
                className="items-start w-full"
              >
                <Title text={`${name}'s Gender:`} />
                <View className="flex-row flex-wrap gap-3 mt-2">
                  {GenderOption.map((item) => (
                    <TouchableOpacity
                      key={item.index}
                      onPress={() => setGender(item.value)}
                      className={`px-6 py-3 rounded-2xl border ${
                        gender === item.value
                          ? "bg-primaryblue border-primaryblue"
                          : "bg-background border-gray-300"
                      }`}
                    >
                      <Text
                        className={`font-Poppinsmedium ${
                          gender === item.value ? "text-white" : "text-black"
                        }`}
                      >
                        {item.option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Animated.View>
              <Animated.View
                entering={FadeInDown.delay(400).duration(400).springify()}
              >
                <PrimaryButton
                  action={handleProcees}
                  text="Proceed"
                  disability={disabilityStatus}
                />
              </Animated.View>
              <View>
                <TouchableOpacity onPress={handleLogOut}>
                  <Text>LOGOUT!!!!!!!!!!!!!!!!!</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Animated.View
        entering={FadeInDown.delay(200).duration(400).springify()}
        className="flex items-center mb-1 gap-mid"
      >
        <Description text="LamiSewa © 2026. All rights reserved." />
      </Animated.View>
      {loading && <LottieLoadingAnimation />}
    </SafeAreaView>
  );
};

export default BasicInfo;
