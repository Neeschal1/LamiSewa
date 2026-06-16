import { View, Text, StatusBar } from "react-native";
import React, { FC } from "react";

const Login: FC = () => {
  return (
    <View className="flex-1">
      <StatusBar hidden translucent />
      <Text>Login</Text>
    </View>
  );
};

export default Login;
