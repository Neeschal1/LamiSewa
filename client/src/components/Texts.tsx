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

export const SubText: FC<TextProps> = ({ text }) => {
  return (
    <Text className="font-Poppinslight text-darkvariant text-center text-description">
      {text}
    </Text>
  );
};

export const ErrorText: FC<TextProps> = ({ text }) => {
  return (
    <Text className="font-Poppinsmedium w-full text-primaryred text-subtitle text-center">
      {text}
    </Text>
  );
};

export const Heading: FC<TextProps> = ({ text }) => {
  return (
    <Text className="font-Poppinssemibold text-background text-screenname">
      {text}
    </Text>
  );
};

export const SubHeading: FC<TextProps> = ({ text }) => {
  return (
    <Text className="font-Poppinsmedium text-background text-heading">{text}</Text>
  );
};

export const Describe: FC<TextProps> = ({ text }) => {
  return (
    <Text className="font-Poppinsregular text-center text-background text-hobbies">
      {text}
    </Text>
  );
};
