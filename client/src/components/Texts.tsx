import { FC } from "react";
import { Text } from "react-native";
import { TextProps } from "./componentsType";

export const MainScreenName: FC<TextProps> = ({ text }) => {
  return (
    <Text className="font-Poppinssemibold text-dark text-screenname">
      {text}
    </Text>
  );
};

export const Title: FC<TextProps> = ({ text }) => {
  return (
    <Text className="font-Poppinsmedium text-dark text-heading">{text}</Text>
  );
};

export const SubTitle: FC<TextProps> = ({ text }) => {
  return (
    <Text className="font-Poppinsregular text-dark text-subheading">
      {text}
    </Text>
  );
};

export const Description: FC<TextProps> = ({ text }) => {
  return (
    <Text className="font-Poppinslight text-dark text-description">{text}</Text>
  );
};

export const ErrorText: FC<TextProps> = ({ text }) => {
  return (
    <Text className="font-Poppinsmedium w-full text-primaryred text-subtitle text-center">{text}</Text>
  );
};
