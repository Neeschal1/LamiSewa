import { View, Text, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Description, Title } from "@/src/components/Texts";

const termsOfUse = [
  {
    id: 1,
    title: "1. Acceptance of Terms",
    description:
      "By accessing or using Bihebari Matrimony, you agree to comply with and be bound by these Terms of Use. If you do not agree with these terms, please do not use the application.",
  },
  {
    id: 2,
    title: "2. Eligibility",
    description:
      "You must be legally eligible for marriage according to the laws applicable in your country or region. Users must provide accurate and truthful information during registration.",
  },
  {
    id: 3,
    title: "3. User Accounts",
    description:
      "Users are responsible for maintaining the confidentiality of their login credentials and account activities. Sharing accounts or impersonating another person is strictly prohibited.",
  },
  {
    id: 4,
    title: "4. User Conduct",
    description:
      "Users agree not to upload false information, offensive content, abusive messages, or engage in harassment, fraud, illegal activity, or misuse of the platform.",
  },
  {
    id: 5,
    title: "5. Profile Verification",
    description:
      "Bihebari Matrimony may verify profiles, phone numbers, or documents to improve trust and safety. However, users are encouraged to independently verify information before making personal decisions.",
  },
  {
    id: 6,
    title: "6. Content Ownership",
    description:
      "Users retain ownership of the content they upload but grant Bihebari Matrimony permission to display and use such content for providing matrimonial services within the platform.",
  },
  {
    id: 7,
    title: "7. Privacy",
    description:
      "Your use of the platform is also governed by our Privacy Policy. By using the application, you consent to the collection and use of your information as described in the Privacy Policy.",
  },
  {
    id: 8,
    title: "8. Subscription & Payments",
    description:
      "Certain features may require paid subscriptions or premium services. All payments are subject to applicable terms, pricing, and refund policies displayed within the app.",
  },
  {
    id: 9,
    title: "9. Account Suspension",
    description:
      "We reserve the right to suspend or permanently remove accounts that violate these terms, engage in suspicious activity, provide false information, or misuse the platform.",
  },
  {
    id: 10,
    title: "10. Limitation of Liability",
    description:
      "Bihebari Matrimony is a matchmaking platform and does not guarantee marriage, compatibility, or the accuracy of user-provided information. Users interact at their own discretion and responsibility.",
  },
  {
    id: 11,
    title: "11. Changes to Terms",
    description:
      "We may update these Terms of Use at any time. Continued use of the application after updates constitutes acceptance of the revised terms.",
  },
  {
    id: 12,
    title: "12. Contact Information",
    description:
      "If you have any questions regarding these Terms of Use, please contact the Bihebari Matrimony support team through the application.",
  },
];

const TermsOfUse = () => {
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
        <View className="flex p-screen gap-large">
          {termsOfUse.map((index) => (
            <View key={index.id} className="flex">
              <Title text={index.title} />
              <Description text={index.description} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsOfUse;
