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
import { CommunityItems, DietItems } from "@/src/utils/objects";

const AdditionalInfo: FC = () => {
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [religion, setReligion] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");

  const [community, setCommunity] = useState<string | null>(null);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [communityItem, setCommunityItem] = useState(CommunityItems);

  const [diet, setDiet] = useState<string | null>(null);
  const [dietOpen, setDietOpen] = useState(false);
  const [dietItem, setDietItem] = useState(DietItems);

  const handleProceed = () => {
    if (!religion || !height || !weight || !community || !diet) {
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
          <Title text="Additional Information (3/6)" />
          <ErrorText text={`${errorMessage}`} />
        </View>
        <View className="flex items-center gap-mid">
          <View className="items-start w-full">
            <Title text="Religion:" />
            <InputFields
              plchldr="eg: Hindu"
              state={religion}
              setState={setReligion}
              board="default"
            />
          </View>
          <View className="items-start w-full">
            <Title text="Height:" />
            <InputFields
              plchldr="eg: 5 ft 5 inch"
              state={height}
              setState={setHeight}
              board="default"
            />
          </View>
          <View className="items-start w-full">
            <Title text="Weight:" />
            <InputFields
              plchldr="eg: 50kg"
              state={weight}
              setState={setWeight}
              board="default"
            />
          </View>
          <View className="w-full z-4">
            <Title text="Community:" />
            <CustomDropdown
              open={communityOpen}
              value={community}
              items={communityItem}
              setOpen={setCommunityOpen}
              setValue={setCommunity}
              setItems={setCommunityItem}
            />
          </View>
          <View style={{ zIndex: 1000 }} className="w-full z-1">
            <Title text="Diet:" />
            <CustomDropdown
              open={dietOpen}
              value={diet}
              items={dietItem}
              setOpen={setDietOpen}
              setValue={setDiet}
              setItems={setDietItem}
            />
          </View>
        </View>
        <PrimaryButton action={handleProceed} text="Proceed" screen="CareerInfo"/>
      </View>
      <View className="flex items-center w-full">
        <Description text="Bihebari © 2026. All rights reserved." />
      </View>
    </SafeAreaView>
  );
};

export default AdditionalInfo;
