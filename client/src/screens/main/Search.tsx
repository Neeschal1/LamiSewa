import { View, Text, StatusBar } from "react-native";
import React, { FC } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Search: FC = () => {
  return (
    <SafeAreaView className="flex flex-1 bg-background">
      <View className="flex-1 items-center justify-center bg-background">
        <StatusBar hidden translucent />
        <Text>Search</Text>
      </View>
    </SafeAreaView>
  );
};

export default Search;
