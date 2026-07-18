import { Describe, Description, SubHeading, SubTitle, Title } from "@/src/components/systemComponentsLayout";
import React from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const privacyPolicy = [
  {
    id: 1,
    title: "1. Introduction",
    description:
      "Welcome to Bihebari Matrimony. We are committed to protecting your privacy and ensuring a safe matrimonial experience. This Privacy Policy explains how we collect, use, and protect your information when you use our application and services.",
  },
  {
    id: 2,
    title: "2. Information We Collect",
    description:
      "We may collect personal details including your name, phone number, email address, gender, date of birth, religion, education, profession, profile photos, preferences, and other information you voluntarily provide while using the app.",
  },
  {
    id: 3,
    title: "3. How We Use Your Information",
    description:
      "Your information is used to create your matrimonial profile, provide matchmaking services, improve user experience, communicate important updates, verify accounts, and maintain platform security.",
  },
  {
    id: 4,
    title: "4. Profile Visibility",
    description:
      "Your profile information may be visible to other registered users of the platform according to your privacy settings. We encourage users not to share sensitive personal or financial information with unknown individuals.",
  },
  {
    id: 5,
    title: "5. Data Security",
    description:
      "We implement reasonable security measures to protect your personal information from unauthorized access, misuse, or disclosure. However, no online platform can guarantee complete security.",
  },
  {
    id: 6,
    title: "6. User Responsibilities",
    description:
      "Users are responsible for maintaining confidentiality of their account credentials and for the information shared through the platform. Any misuse, fake profiles, harassment, or illegal activity may result in account suspension.",
  },
  {
    id: 7,
    title: "7. Third-Party Services",
    description:
      "Bihebari Matrimony may use third-party services such as analytics, payment gateways, notification systems, or authentication providers. These services may collect limited technical information required for functionality.",
  },
  {
    id: 8,
    title: "8. Cookies & Device Information",
    description:
      "We may collect device-related information such as device model, operating system, IP address, app version, and usage data to improve app performance and user experience.",
  },
  {
    id: 9,
    title: "9. Account Deletion",
    description:
      "Users may request account deletion at any time. Upon deletion request, personal information may be removed from active systems within a reasonable period, subject to legal and operational requirements.",
  },
  {
    id: 10,
    title: "10. Changes to Privacy Policy",
    description:
      "We reserve the right to update or modify this Privacy Policy at any time. Updated policies will be posted within the application.",
  },
  {
    id: 11,
    title: "11. Contact Us",
    description:
      "If you have any questions, concerns, or requests regarding this Privacy Policy, please contact the Bihebari Matrimony support team through the application.",
  },
];

const PrivacyPolicy = () => {
  return (
    <SafeAreaView
      edges={["bottom"]}
      className="bg-background flex flex-1 items-center justify-center"
    >
      <ScrollView style={{width: '100%', height: '100%', flex: 1}} contentContainerStyle={{alignItems: "center", justifyContent: "center"}}>
        {/* <View className="flex bg-primaryblue w-full items-center py-10">
          <SubHeading text="LamiSewa" />
          <Describe text="Your Privacy and Personal Data are Important to us." />
        </View> */}
        <View className="flex p-screen gap-large">
          {privacyPolicy.map((index)=>(<View key={index.id} className="flex">
            <Title text={index.title} />
            <Description text={index.description} />
          </View>))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;
