import { View, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import {
  Description,
  Heading,
  MainScreenName,
  SubHeading,
  SubText,
  SubTitle,
  Title,
} from "@/src/components/Texts";

export const teamMembers = [
  {
    id: 1,
    name: "Ananta Poudel",
    role: "Founder & Chief Executive Officer",
    image: require("@/src/assets/images/anantapoudel.jpg"),
    description:
      "Founded LamiSewa with the vision of creating a trusted, secure, and technology-driven matrimonial platform that connects people through meaningful relationships. Oversees business strategy, product vision, and long-term organizational growth.",
  },
  {
    id: 2,
    name: "Nischal Pokharel",
    role: "Full Stack Developer & UI/UX Designer",
    image: require("@/src/assets/images/nischalpokharel.jpg"),
    description:
      "Responsible for the end-to-end development of LamiSewa, including mobile application development, backend architecture, database design, API integration, and user experience design. Focused on building a modern, scalable, and user-centric platform.",
  },
];

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
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full gap-extralarge">
          {teamMembers.map((member) => (
            <View key={member.id} className="overflow-hidden gap-extrasmall">
              <Image
                source={member.image}
                resizeMode="cover"
                style={{ height: 400, width: "100%" }}
              />
              <View className="p-screen gap-small mt-[-10px]">
                <View className="flex w-full">
                  <MainScreenName text={member.name} />
                  <View className="flex mt-[-10px]">
                    <Title text={member.role} />
                  </View>
                  <Description text={member.description} />
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutUs;
