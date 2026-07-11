import LottieView from "lottie-react-native";
import { View } from "react-native"

const loadingAnimation = require("@/src/assets/animations/lottieLoading.json");

export const LottieLoadingAnimation = () => {
  return (
    <View
  className="absolute inset-0 items-center justify-center"
  style={{
    backgroundColor: "rgba(255,255,255,0.6)",
  }}
>
      <LottieView
        source={loadingAnimation}
        autoPlay
        loop
        style={{
          width: 320,
          height: 320,
        }}
      />
    </View>
  );
};
