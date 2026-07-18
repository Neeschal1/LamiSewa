import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { Description, SubHeading, SubTitle, Title } from "@/src/components/Texts";
import { Ionicons } from "@expo/vector-icons";

const contactInformation: {
  id: number;
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  type: string;
}[] = [
  {
    id: 1,
    title: "Email Support",
    value: "help@bihebari.com",
    icon: "mail-outline",
    type: "email",
  },
  {
    id: 2,
    title: "Phone Number",
    value: "+977 985-1418011",
    icon: "call-outline",
    type: "phone",
  },
  {
    id: 3,
    title: "Office Address",
    value: "Kathmandu, Nepal",
    icon: "location-outline",
    type: "address",
  },
];

const ContactUs = () => {
  return (
    <SafeAreaView
      edges={["bottom"]}
      className="bg-background flex flex-1 items-center justify-center"
    >
        <View className="flex p-screen items-center justify-center flex-1">
          {contactInformation.map((item) => (
            <View
              key={item.id}
              className="flex-row w-full items-center bg-white rounded-3xl p-5 mb-5 border border-gray-200"
            >
              <View className="w-16 h-16 bg-primaryred rounded items-center justify-center">
                <Ionicons name={item.icon} size={30} color="#FFFFFF" />
              </View>

              <View className="ml-5 flex-1">
                <SubTitle text={item.title} />
                <Description text={item.value} />
              </View>
            </View>
          ))}
        </View>
    </SafeAreaView>
  );
};

export default ContactUs;
