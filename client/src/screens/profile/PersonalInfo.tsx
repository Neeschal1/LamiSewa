import {
  View,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { FC, useState } from "react";
import {
  InputFields,
  Title,
  CustomDropdown,
  PrimaryButton,
  ErrorText,
  Description,
} from "@/src/components/systemComponentsLayout";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  GotraItems,
  MaritalStatusItems,
  ResidencyStatusItems,
} from "@/src/utils/objects";

const PersonalInfo: FC = () => {
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [livingCountry, setLivingCountry] = useState<string>("");
  const [district, setDistrict] = useState<string>("");

  const [gotra, setGotra] = useState<string | null>(null);
  const [gotraOption, setGotraOption] = useState(false);
  const [gotraItems, setGotraItems] = useState(GotraItems);

  const [maritalStatus, setMaritalStatus] = useState<string | null>(null);
  const [maritalStatusOpen, setMaritalStatusOpen] = useState(false);
  const [maritalStatusItems, setMaritalStatusItems] =
    useState(MaritalStatusItems);

  const [residencyStatus, setResidencyStatus] = useState<string | null>(null);
  const [residencyStatusOpen, setResidencyStatusOpen] = useState(false);
  const [residencyStatusItems, setResidencyStatusItems] =
    useState(ResidencyStatusItems);

  const [navigatingScreen, setNavigatingScreen] = useState<string>("")

  const handleProceed = () => {
    if (
      !livingCountry ||
      !district ||
      !maritalStatus ||
      !gotra ||
      !residencyStatus
    ) {
      setError(true);
      setErrorMessage("Please fill up all the details first!");
      return;
    }
    setError(false);
    setErrorMessage("");
    setNavigatingScreen("AdditionalInfo")
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
          <View className="flex-1 items-center justify-start p-screen bg-background gap-large pt-extralarge">
            <StatusBar hidden translucent />
            <ErrorText text={`${errorMessage}`} />
            <View className="flex items-center gap-mid">
              <View className="items-start w-full">
                <Title text="Current living country:" />
                <InputFields
                  plchldr="eg: Nepal"
                  state={livingCountry}
                  setState={setLivingCountry}
                  board="default"
                />
              </View>
              <View className="items-start w-full">
                <Title text="District/City:" />
                <InputFields
                  plchldr="eg: Kathmandu"
                  state={district}
                  setState={setDistrict}
                  board="default"
                />
              </View>
              <View className="w-full">
                <Title text="Marital Status" />
                <CustomDropdown
                  open={maritalStatusOpen}
                  value={maritalStatus}
                  items={maritalStatusItems}
                  setOpen={setMaritalStatusOpen}
                  setValue={setMaritalStatus}
                  setItems={setMaritalStatusItems}
                />
              </View>
              <View className="w-full">
                <Title text="Gotra" />
                <CustomDropdown
                  open={gotraOption}
                  value={gotra}
                  items={gotraItems}
                  setOpen={setGotraOption}
                  setValue={setGotra}
                  setItems={setGotraItems}
                />
              </View>
              <View className="w-full">
                <Title text="Residency Status" />

                <CustomDropdown
                  open={residencyStatusOpen}
                  value={residencyStatus}
                  items={residencyStatusItems}
                  setOpen={setResidencyStatusOpen}
                  setValue={setResidencyStatus}
                  setItems={setResidencyStatusItems}
                />
              </View>
            </View>
            <PrimaryButton
              action={handleProceed}
              text="Proceed"
              screen={navigatingScreen}
            />
          </View>
          <View className="flex items-center w-full">
            <Description text="LamiSewa © 2026. All rights reserved." />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PersonalInfo;
