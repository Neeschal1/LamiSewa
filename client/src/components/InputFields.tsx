import { View, TextInput, Dimensions, TouchableOpacity } from "react-native";
import React, { FC, useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  InputFieldProps,
  GradientInputWrapperProps,
  OTPInputProps,
  InputPasswordProps,
  DOBInputProps,
} from "./componentsType";
import { Ionicons } from "@expo/vector-icons";

const gradientActiveColors = ["#FC404E", "#4987F6", "#192f6a"] as const;
const gradientInactiveColor = ["#CBCBCB", "#CBCBCB"] as const;

const screenheight = Dimensions.get("window").height;
const screenwidth = Dimensions.get("window").width;

export const GradientInputWrapper: FC<GradientInputWrapperProps> = ({
  children,
  hasText = false,
}) => {
  return (
    <LinearGradient
      colors={hasText ? gradientActiveColors : gradientInactiveColor}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ borderRadius: 10, padding: 1 }}
    >
      <View style={{ backgroundColor: "#F6F5FF", borderRadius: 8 }}>
        {children}
      </View>
    </LinearGradient>
  );
};

export const InputFields: FC<InputFieldProps> = ({
  plchldr,
  state,
  setState,
  board,
}) => {
  return (
    <GradientInputWrapper hasText={state.length > 0}>
      <TextInput
        value={state}
        onChangeText={setState}
        placeholder={plchldr}
        keyboardType={board}
        className="font-Poppinsregular text-[15px] text-dark items-center justify-center"
        placeholderTextColor="#7B7B7B"
        style={{
          height: screenheight * 0.061,
          width: screenwidth * 0.883,
          paddingTop: 12,
          paddingLeft: 10,
        }}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </GradientInputWrapper>
  );
};

export const InputPassword: FC<InputPasswordProps> = ({
  plchldr,
  state,
  setState,
  board,
  visibility,
  setVisibility,
}) => {
  return (
    <GradientInputWrapper hasText={state.length > 0}>
      <View className="flex-row w-full items-center justify-between">
        <TextInput
          value={state}
          onChangeText={setState}
          placeholder={plchldr}
          keyboardType={board}
          secureTextEntry={!visibility}
          className="font-Poppinsregular text-[15px] text-dark flex-1"
          placeholderTextColor="#7B7B7B"
          style={{
            height: screenheight * 0.061,
            paddingTop: 12,
            paddingLeft: 10,
          }}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity
          onPress={() => setVisibility((prev) => !prev)}
          className="pr-4"
        >
          <Ionicons
            name={visibility ? "eye-outline" : "eye-off-outline"}
            size={22}
            color="#7B7B7B"
          />
        </TouchableOpacity>
      </View>
    </GradientInputWrapper>
  );
};

export const OTPInputFields: FC<OTPInputProps> = ({ otp, setOtp }) => {
  const refs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    const value = text.replace(/[^0-9]/g, "");

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (text: string, index: number) => {
    if (!text && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex-row justify-between w-full">
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            refs.current[index] = ref;
          }}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === "Backspace") {
              handleBackspace(digit, index);
            }
          }}
          keyboardType="number-pad"
          maxLength={1}
          textAlign="center"
          className="font-Poppinsmedium text-dark text-lg"
          style={{
            width: screenwidth * 0.13,
            height: screenheight * 0.06,
            borderWidth: 1,
            borderColor: digit ? "#FC404E" : "#CBCBCB",
            borderRadius: 10,
            backgroundColor: "#F6F5FF",
          }}
        />
      ))}
    </View>
  );
};

export const DOBInput: FC<DOBInputProps> = ({ dob, setDob }) => {
  const refs = useRef<(TextInput | null)[]>([]);

  const handleChange = (
    text: string,
    field: "day" | "month" | "year",
    index: number,
  ) => {
    const value = text.replace(/[^0-9]/g, "");

    setDob((prev) => ({
      ...prev,
      [field]: value,
    }));

    const maxLength = field === "year" ? 4 : 2;

    if (value.length === maxLength && index < 2) {
      refs.current[index + 1]?.focus();
    }
  };

  return (
    <View className="flex-row gap-3">
      <TextInput
        ref={(ref) => {
          refs.current[0] = ref;
        }}
        value={dob.day}
        onChangeText={(text) => handleChange(text, "day", 0)}
        placeholder="DD"
        keyboardType="number-pad"
        maxLength={2}
        textAlign="center"
        className="font-Poppinsmedium text-dark"
        style={{
          width: 60,
          height: 50,
          borderWidth: 1,
          borderColor: dob.day ? "#FC404E" : "#CBCBCB",
          borderRadius: 10,
          backgroundColor: "#F6F5FF",
        }}
      />

      <TextInput
        ref={(ref) => {
          refs.current[0] = ref;
        }}
        value={dob.month}
        onChangeText={(text) => handleChange(text, "month", 1)}
        placeholder="MM"
        keyboardType="number-pad"
        maxLength={2}
        textAlign="center"
        className="font-Poppinsmedium text-dark"
        style={{
          width: 60,
          height: 50,
          borderWidth: 1,
          borderColor: dob.month ? "#FC404E" : "#CBCBCB",
          borderRadius: 10,
          backgroundColor: "#F6F5FF",
        }}
      />

      <TextInput
        ref={(ref) => {
          refs.current[0] = ref;
        }}
        value={dob.year}
        onChangeText={(text) => handleChange(text, "year", 2)}
        placeholder="YYYY"
        keyboardType="number-pad"
        maxLength={4}
        textAlign="center"
        className="font-Poppinsmedium text-dark"
        style={{
          width: 90,
          height: 50,
          borderWidth: 1,
          borderColor: dob.year ? "#FC404E" : "#CBCBCB",
          borderRadius: 10,
          backgroundColor: "#F6F5FF",
        }}
      />
    </View>
  );
};
