import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";

const AboutUs = () => {
  return (
    <SafeAreaView
      edges={["bottom"]}
      className="bg-background flex flex-1 items-center justify-center"
    >
      <ScrollView
        style={{ width: "100%", height: "100%", flex: 1 }}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutUs;
