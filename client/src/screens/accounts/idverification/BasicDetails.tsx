import { View, Text, StatusBar } from "react-native";
import React, { useState } from "react";
import Animated, {
  FadeInUp,
  FadeInDown,
  BounceIn,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CustomDropdown,
  Description,
  DOBInput,
  ErrorText,
  InputFields,
  PrimaryButton,
  Title,
} from "@/src/components/systemComponentsLayout";
import { CalendarItems } from "@/src/utils/objects";

const BasicDetails = () => {
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [name, setName] = useState<string>("");

  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<"AD" | "BS">("AD");
  const [items, setItems] = useState(CalendarItems);

  const [date, setDate] = useState({
    day: "",
    month: "",
    year: "",
  });

  const [address, setAddress] = useState<string>("");

  const handleContinue = () => {
    if (!name || !date || !address){
        setError(true);
        setErrorMessage("You must fulfill all following details \nin order to continue!");
        return;
    }

  }

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-background">
      <StatusBar hidden={false} />
      <View className="flex-1 w-full bg-background p-screen items-center gap-large justify-start">
        <Animated.View entering={FadeInUp.delay(200).duration(400).springify()}>
          <View>
            {error ? (
              <Animated.View
                entering={BounceIn.delay(200).duration(300)}
                className="flex align-start"
              >
                <ErrorText text={`${errorMessage}`} /> 
              </Animated.View>
            ) : null}
          </View>
        </Animated.View>
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
        <Animated.View
          entering={FadeInUp.delay(400).duration(400).springify()}
          className="items-start w-full"
        >
          <Title text="Date of Birth" />
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
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(400).duration(400).springify()}
          className="items-start w-full"
        >
          <Title text="Address(Permanent):" />
          <InputFields
            plchldr="eg: Kathmandu, Nepal"
            state={address}
            setState={setAddress}
            board="default"
          />
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(200).duration(400).springify()}
        >
          <PrimaryButton action={handleContinue} text="Continue" />
        </Animated.View>
      </View>
      <Animated.View
        entering={FadeInDown.delay(200).duration(400).springify()}
        className="flex items-center w-full"
      >
        <Description text="LamiSewa © 2026. All rights reserved." />
      </Animated.View>
    </SafeAreaView>
  );
};

export default BasicDetails;
