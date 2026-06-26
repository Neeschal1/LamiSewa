import {
  View,
  Text,
  StatusBar,
  Switch,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { FC, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Description,
  ErrorText,
  MainScreenName,
  SubTitle,
} from "@/src/components/systemComponentsLayout";
import { Ionicons } from "@expo/vector-icons";
import { DummyUsers } from "@/src/utils/DummyData";

const Notification: FC = () => {
  const [enabled, setEnabled] = useState<boolean>(false);

  return (
    <SafeAreaView className="flex flex-1 bg-background">
      <View className="flex-1 items-center w-full justify-start bg-background p-screen">
        <StatusBar hidden={false} translucent />

        <MainScreenName text="Notifications" />

        <View className="gap-mid w-full flex-row items-center justify-between">
          <View className="flex flex-row gap-mid">
            <Ionicons name="notifications" size={24} color="black" />
            <SubTitle text="App Notification" />
          </View>
          <Switch
            value={enabled}
            onValueChange={setEnabled}
            trackColor={{ false: "#BBBDC8", true: "#FF000E" }}
            thumbColor={enabled ? "#FFFFFF" : "#FFFFFF"}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex flex-1 gap-mid mt-mid">
            {DummyUsers.map((index) => (
              <TouchableOpacity className="flex flex-row gap-small items-center">
                <Image
                  className="h-20 w-20 rounded-full"
                  source={{ uri: `${index.basicInfo.profile_picture}` }}
                />
                <View className="flex">
                  <ErrorText
                    text={`${index.basicInfo.fullname} sent you a match request.`}
                  />
                  <Description text="Say Hi to her." />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Notification;
