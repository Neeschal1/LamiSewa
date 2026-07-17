import { TouchableOpacity, Dimensions, Text, Image, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { act, FC } from "react";
import {
  ButtonProps,
  NavigationProps,
  SocialButtonProps,
} from "./componentsType";
import { useNavigation } from "@react-navigation/native";

const screenheight = Dimensions.get("window").height;
const screenwidth = Dimensions.get("window").width;

export const PrimaryButton: FC<ButtonProps> = ({
  text,
  action,
  screen,
  disability,
}) => {
  const navigation = useNavigation<NavigationProps>();

  const handleButtonPress = () => {
    if (screen) {
      navigation.navigate(screen);
    }
    if (action) {
      action();
      return;
    }
  };

  return (
    <TouchableOpacity
      style={{
        opacity: disability ? 0.5 : 1,
      }}
      disabled={disability}
      onPress={handleButtonPress}
    >
      <LinearGradient
        colors={["#FC404E", "#4987F6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          width: "100%",
          height: screenheight * 0.061,
          borderRadius: 10,
          backgroundColor: "#000",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text className="text-white text-subheading font-Poppinsmedium">
          {text}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export const SecondaryButton: FC<ButtonProps> = ({
  text,
  action,
  screen,
  disability,
}) => {
  const navigation = useNavigation<NavigationProps>();

  const handleButtonPress = () => {
    if (screen) {
      navigation.navigate(screen);
    }
    if (action) {
      action();
      return;
    }
  };

  return (
    <TouchableOpacity
      style={{
        opacity: disability ? 0.5 : 1,
      }}
      disabled={disability}
      onPress={handleButtonPress}
    >
      <LinearGradient
        colors={["#FC404E", "#4987F6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          // width: screenwidth * 0.886,
          height: screenheight * 0.061,
          borderRadius: 12,
          backgroundColor: "#000",
          justifyContent: "center",
          alignItems: "center",
          padding: 1.2
        }}
      >
        <View className="flex flex-1 bg-white justify-center items-center w-full rounded-xl">
          <Text className="text-dark text-subheading font-Poppinsmedium">
          {text}
        </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export const TextualButton: FC<ButtonProps> = ({ text, action, screen }) => {
  const navigation = useNavigation<NavigationProps>();

  const handleButtonPress = () => {
    if (action) {
      action();
      return;
    }
    if (screen) {
      navigation.navigate(screen);
    }
  };

  return (
    <TouchableOpacity onPress={handleButtonPress}>
      <Text className="font-Poppinsmedium text-primaryblue text-subheading">
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export const SocialButton: FC<SocialButtonProps> = ({
  btnname,
  text,
  action,
  logo,
}) => {
  const handleButtonPress = () => {
    if (action) {
      action();
      return;
    }
  };
  return (
    <TouchableOpacity
      style={{
        width: screenwidth * 0.886,
        height: screenheight * 0.061,
      }}
      className={`flex rounded-xl flex-row gap-4 items-center justify-center ${btnname === "facebook" ? "bg-primaryblue" : "bg-[#383838]"}`}
      onPress={handleButtonPress}
    >
      <Image source={logo} />
      <Text className="font-Poppinsmedium text-background text-subtitle">
        {text}
      </Text>
    </TouchableOpacity>
  );
};
