import { TouchableOpacity, Dimensions, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { act, FC } from "react";
import { ButtonProps } from "./componentsType";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "./componentsType";

const screenheight = Dimensions.get("window").height;
const screenwidth = Dimensions.get("window").width;

export const PrimaryButton: FC<ButtonProps> = ({ text, action, screen }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleButtonPress = () => {
    if (action) {
      console.log(action);
      return;
    }
    if (screen) {
      navigation.navigate(screen as keyof RootStackParamList);
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
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleButtonPress = () => {
    if (action) {
      console.log(action);
      return;
    }
    if (screen) {
      navigation.navigate(screen as keyof RootStackParamList);
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
