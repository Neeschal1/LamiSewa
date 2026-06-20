import {
  View,
  Text,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { FC, useState } from "react";
import Animated, {
  FadeInUp,
  FadeInDown,
  BounceIn,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CustomDropdown,
  Description,
  ErrorText,
  InputFields,
  PrimaryButton,
  Title,
} from "@/src/components/systemComponentsLayout";
import { DegreeItems, WorkingItems } from "@/src/utils/objects";

const CareerInfo: FC = () => {
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [degree, setDegree] = useState<string | null>(null);
  const [degreeOpen, setDegreeOpen] = useState(false);
  const [degreeItem, setDegreeItem] = useState(DegreeItems);

  const [working, setWorking] = useState<string | null>(null);
  const [workingOpen, setWorkingOpen] = useState(false);
  const [workingItem, setWorkingItem] = useState(WorkingItems);

  const [college, setCollege] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [profession, setProfession] = useState<string>("");

  const handleProceed = () => {
    if (!degree || !working || !college || !profession || !companyName) {
      setError(true);
      setErrorMessage("Please fill up all the details first!");
      return;
    }
    setError(false);
    setErrorMessage("");
  };

  return (
    <SafeAreaView edges={["bottom"]} className="bg-background flex flex-1">
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 80}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 flex items-center justify-start p-screen bg-background gap-large">
            <StatusBar hidden translucent />
            <Animated.View
              key={errorMessage}
              entering={BounceIn.delay(200).duration(300)}
            >
              <ErrorText text={`${errorMessage}`} />
            </Animated.View>
            <View className="flex items-center gap-mid">
              <Animated.View
                entering={FadeInUp.delay(200).duration(400).springify()}
                className="w-full z-4"
              >
                <Title text="Education:" />
                <Title text="Highest Qualification:" />
                <CustomDropdown
                  open={degreeOpen}
                  value={degree}
                  items={degreeItem}
                  setOpen={setDegreeOpen}
                  setValue={setDegree}
                  setItems={setDegreeItem}
                />
              </Animated.View>
              <Animated.View
                entering={FadeInUp.delay(400).duration(400).springify()}
                className="items-start w-full"
              >
                <Title text="College Name:" />
                <InputFields
                  plchldr="eg: Butwal Multiple Campus"
                  state={college}
                  setState={setCollege}
                  board="default"
                />
              </Animated.View>
              <Animated.View
                entering={FadeInUp.delay(600).duration(400).springify()}
                className="w-full mt-mid"
              >
                <Title text="Profession:" />
                <Title text="Currently Working in:" />
                <CustomDropdown
                  open={workingOpen}
                  value={working}
                  items={workingItem}
                  setOpen={setWorkingOpen}
                  setValue={setWorking}
                  setItems={setWorkingItem}
                />
              </Animated.View>
              <Animated.View
                entering={FadeInDown.delay(600).duration(400).springify()}
                className="items-start w-full"
              >
                <Title text="Working Place (Office Name):" />
                <InputFields
                  plchldr="eg: Meta"
                  state={companyName}
                  setState={setCompanyName}
                  board="default"
                />
              </Animated.View>
              <Animated.View
                entering={FadeInDown.delay(400).duration(400).springify()}
                className="items-start w-full"
              >
                <Title text="Working as:" />
                <InputFields
                  plchldr="eg: Software Engineer"
                  state={profession}
                  setState={setProfession}
                  board="default"
                />
              </Animated.View>
            </View>
            <Animated.View
              entering={FadeInDown.delay(300).duration(400).springify()}
            >
              <PrimaryButton
                screen="HobbiesInfo"
                action={handleProceed}
                text="Proceed"
              />
            </Animated.View>
          </View>
          <Animated.View
            entering={FadeInDown.delay(200).duration(400).springify()}
            className="flex items-center w-full"
          >
            <Description text="LamiSewa © 2026. All rights reserved." />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CareerInfo;
