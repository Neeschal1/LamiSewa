import { View, Text, StatusBar } from "react-native";
import React, { FC, useState } from "react";
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
    <SafeAreaView className="bg-background flex flex-1">
      <View className="flex-1 items-center justify-start p-screen bg-background gap-large pt-extralarge">
        <StatusBar hidden translucent />
        <View className="flex items-center">
          <Title text="Career Information (4/6)" />
          <ErrorText text={`${errorMessage}`} />
        </View>
        <View className="flex items-center gap-mid">
          <View className="w-full z-4">
            <Title text="Highest Qualification:" />
            <CustomDropdown
              open={degreeOpen}
              value={degree}
              items={degreeItem}
              setOpen={setDegreeOpen}
              setValue={setDegree}
              setItems={setDegreeItem}
            />
          </View>
          <View className="items-start w-full">
            <Title text="College Name:" />
            <InputFields
              plchldr="eg: Butwal Multiple Campus"
              state={college}
              setState={setCollege}
              board="default"
            />
          </View>
          <View className="w-full z-4">
            <Title text="Currently Working in:" />
            <CustomDropdown
              open={workingOpen}
              value={working}
              items={workingItem}
              setOpen={setWorkingOpen}
              setValue={setWorking}
              setItems={setWorkingItem}
            />
          </View>
          <View className="items-start w-full">
            <Title text="Working Place (Office Name):" />
            <InputFields
              plchldr="eg: Meta"
              state={companyName}
              setState={setCompanyName}
              board="default"
            />
          </View>
          <View className="items-start w-full">
            <Title text="Working as:" />
            <InputFields
              plchldr="eg: Software Engineer"
              state={profession}
              setState={setProfession}
              board="default"
            />
          </View>
        </View>
        <PrimaryButton screen="HobbiesInfo" action={handleProceed} text="Proceed" />
      </View>
      <View className="flex items-center w-full">
        <Description text="Bihebari © 2026. All rights reserved." />
      </View>
    </SafeAreaView>
  );
};

export default CareerInfo;
