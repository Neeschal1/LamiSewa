import { View, Text, StatusBar } from "react-native";
import React, { FC, useState } from "react";
import {
  InputFields,
  Title,
  CustomDropdown,
  PrimaryButton,
  ErrorText,
} from "@/src/components/systemComponentsLayout";
import { SafeAreaView } from "react-native-safe-area-context";

const PersonalInfo: FC = () => {
  const [error, setError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  const [livingCountry, setLivingCountry] = useState<string>("");
  const [district, setDistrict] = useState<string>("");

  const [gotra, setGotra] = useState<string | null>(null);
  const [gotraOption, setGotraOption] = useState(false);
  const [gotraItems, setGotraItems] = useState([
    { label: "Bharadwaj", value: "Bharadwaj" },
    { label: "Kashyap", value: "Kashyap" },
    { label: "Atri", value: "Atri" },
    { label: "Gautam", value: "Gautam" },
    { label: "Vashistha", value: "Vashistha" },
    { label: "Jamadagni", value: "Jamadagni" },
    { label: "Vishwamitra", value: "Vishwamitra" },
    { label: "Agastya", value: "Agastya" },
    { label: "Shandilya", value: "Shandilya" },
    { label: "Kaushik", value: "Kaushik" },
    { label: "Parashar", value: "Parashar" },
    { label: "Upamanyu", value: "Upamanyu" },
    { label: "Kapil", value: "Kapil" },
    { label: "Unknown", value: "Unknown" },
  ]);

  const [maritalStatus, setMaritalStatus] = useState<string | null>(null);
  const [maritalStatusOpen, setMaritalStatusOpen] = useState(false);
  const [maritalStatusItems, setMaritalStatusItems] = useState([
    { label: "Never Married", value: "Never Married" },
    { label: "Divorced", value: "Divorced" },
    { label: "Widowed", value: "Widowed" },
    { label: "Separated", value: "Separated" },
    { label: "Awaiting Divorce", value: "Awaiting Divorce" },
  ]);

  const [residencyStatus, setResidencyStatus] = useState<string | null>(null);
  const [residencyStatusOpen, setResidencyStatusOpen] = useState(false);
  const [residencyStatusItems, setResidencyStatusItems] = useState([
    { label: "Nepal Citizen", value: "Nepal Citizen" },
    { label: "Student Visa", value: "Student Visa" },
    { label: "Work Visa", value: "Work Visa" },
    { label: "Permanent Resident (PR)", value: "Permanent Resident" },
    { label: "Dependent Visa", value: "Dependent Visa" },
    { label: "Temporary Resident", value: "Temporary Resident" },
    { label: "Non-Resident Nepali (NRN)", value: "NRN" },
    { label: "Foreign Citizen", value: "Foreign Citizen" },
  ]);

  const handleProceed = () => {
    if(!livingCountry || !district || !maritalStatus || !gotra || !residencyStatus){
      setError(true)
      setErrorMessage("Please fill up all the details first!")
      return;
    }
  }

  return (
    <SafeAreaView className="bg-background flex flex-1">
      <View className="flex-1 items-center justify-start p-screen bg-background gap-large pt-extralarge">
        <StatusBar hidden translucent />
        <View className="flex items-center">
          <Title text="Personal Information (2/6)" />
          <ErrorText text={`${errorMessage}`} />
        </View>
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
          <View style={{ zIndex: 3000 }} className="w-full">
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
          <View style={{ zIndex: 2000 }} className="w-full">
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
          <View style={{ zIndex: 1000 }} className="w-full">
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
        <PrimaryButton action={handleProceed} text="Proceed" />
      </View>
    </SafeAreaView>
  );
};

export default PersonalInfo;
