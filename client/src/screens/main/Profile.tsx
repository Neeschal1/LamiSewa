import { View, Text, StatusBar } from "react-native";
import React, { FC } from "react";

const Profile: FC = () => {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <StatusBar hidden translucent />
      <Text>Neeschal</Text>
    </View>
  );
};

export default Profile;
