import { TouchableOpacity, Dimensions, Text, Image } from "react-native";
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

export const PrimaryButton: FC<ButtonProps> = ({ text, action, screen }) => {
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
      <LinearGradient
        colors={["#FC404E", "#4987F6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          width: screenwidth * 0.886,
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
      <Text className="font-Poppinsbold text-primaryblue text-heading">
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
    if(action){
      action();
      return
    }
  };
  return (
    <TouchableOpacity
      style={{ 
        width: screenwidth * 0.886, 
        height: screenheight * 0.061 
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
