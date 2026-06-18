import { View, StatusBar, Image } from "react-native";
import React, { FC, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, NavigationProp } from "@react-navigation/native";

const logo = require("@/src/assets/images/splashLogo.png");

const Splash:FC = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#E54963" }}>
      <StatusBar hidden translucent />
      <View className="flex-1 bg-[#E54963] justify-center items-center">
        <Image
          source={logo}
          resizeMode="contain"
          style={{ width: 300, height: 300 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Splash;