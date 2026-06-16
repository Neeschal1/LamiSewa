import { View, TextInput, Dimensions } from "react-native";
import React, { FC, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { InputFieldProps, GradientInputWrapperProps, OTPInputProps } from "./componentsType";

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
  board
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
          paddingLeft: 10
        }}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </GradientInputWrapper>
  );
};


export const OTPInputFields: FC<OTPInputProps> = ({
  otp,
  setOtp,
}) => {
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

  const handleBackspace = (
    text: string,
    index: number
  ) => {
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
          onChangeText={(text) =>
            handleChange(text, index)
          }
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
            borderColor: digit
              ? "#FC404E"
              : "#CBCBCB",
            borderRadius: 10,
            backgroundColor: "#F6F5FF",
          }}
        />
      ))}
    </View>
  );
};