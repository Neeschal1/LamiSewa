import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SubHeading, Describe, Title, Description } from "@/src/components/Texts";

// Enable LayoutAnimation for Android
if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const faqs = [
  {
    id: 1,
    question: "How do I create my profile?",
    answer:
      "After signing up, complete your profile by adding your personal information, photos, education, profession, and partner preferences.",
  },
  {
    id: 2,
    question: "How can I upload profile photos?",
    answer:
      "Go to your profile section and tap on the photo upload option to add or update your pictures.",
  },
  {
    id: 3,
    question: "How do I search for matches?",
    answer:
      "Use filters such as age, religion, profession, location, and interests to find suitable matches.",
  },
  {
    id: 4,
    question: "How can I contact another member?",
    answer:
      "You can send interest requests or messages depending on your account permissions and subscription plan.",
  },
  {
    id: 5,
    question: "How do I report fake profiles?",
    answer:
      "Open the user's profile and tap the Report option. Our moderation team will review the report and take appropriate action.",
  },
  {
    id: 6,
    question: "How do I delete my account?",
    answer:
      "You can request account deletion from the Account Settings section. Your request will be processed according to our Privacy Policy.",
  },
  {
    id: 7,
    question: "Is my personal information secure?",
    answer:
      "Yes. We use industry-standard security measures to protect your personal information. Sensitive data is encrypted and handled according to our Privacy Policy.",
  },
  {
    id: 8,
    question: "Why should I verify my profile?",
    answer:
      "Verified profiles increase trust within the community and improve your chances of receiving genuine match requests.",
  },
  {
    id: 9,
    question: "How can I change my password?",
    answer:
      "Go to Account Settings > Change Password, enter your current password, and create a new secure password.",
  },
  {
    id: 10,
    question: "Can I edit my profile after creating it?",
    answer:
      "Yes. You can update your profile information, photos, preferences, education, profession, and other details at any time.",
  },
  {
    id: 11,
    question: "Why can't I see some user profiles?",
    answer:
      "Some profiles may be hidden due to privacy settings, account restrictions, or because they do not match your search preferences.",
  },
  {
    id: 12,
    question: "What happens when I send an interest request?",
    answer:
      "The other member will receive your request and can choose to accept or decline it. Once accepted, additional communication features may become available.",
  },
  {
    id: 13,
    question: "Can I block another user?",
    answer:
      "Yes. Visit the user's profile and select the Block option. Blocked users will no longer be able to contact or view your profile where applicable.",
  },
  {
    id: 14,
    question: "How do I unblock a user?",
    answer:
      "Navigate to Settings > Blocked Users, select the user you wish to unblock, and confirm your action.",
  },
  {
    id: 15,
    question: "How do I update my partner preferences?",
    answer:
      "Open your profile and edit the Partner Preferences section to specify your preferred age, education, profession, religion, location, and other criteria.",
  },
  {
    id: 16,
    question: "Do I need a subscription to use the app?",
    answer:
      "Basic features are available for free. Premium subscriptions unlock additional features such as unlimited messaging, profile boosts, and advanced filters.",
  },
  {
    id: 17,
    question: "How do I purchase or renew a subscription?",
    answer:
      "Go to the Subscription section in the app, choose a plan that suits you, and complete the payment using one of the supported payment methods.",
  },
  {
    id: 18,
    question: "Can I cancel my subscription?",
    answer:
      "Yes. You can cancel your subscription through your account settings or your app store subscription management. Your benefits will remain active until the current billing period ends.",
  },
  {
    id: 19,
    question: "Why is my profile under review?",
    answer:
      "Profiles may be reviewed after registration, profile updates, or user reports to ensure authenticity and maintain a safe community.",
  },
  {
    id: 20,
    question: "How can I contact customer support?",
    answer:
      "Visit the Help or Contact Us section within the app to submit your query. Our support team will respond as soon as possible.",
  },
];

const Help = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { width } = useWindowDimensions();

  const toggle = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
        className="p-screen gap-mid"
      >
        <View className="flex gap-mid">
          {faqs.map((item, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() => toggle(index)}
              className="bg-[#F8F8F8] rounded-2xl w-full"
            >
              <View className="flex-row justify-between items-center p-mid">
                <View className="flex w-11/12">
                  <Title text={item.question} />
                </View>
                <View className="flex">
                  <Ionicons
                  name={
                    openIndex === index
                      ? "chevron-up"
                      : "chevron-down"
                  }
                  size={22}
                  color="#000"
                />
                </View>
              </View>

              {openIndex === index && (
                <View className="flex items-center p-mid">
                  <Description text={item.answer} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
      </ScrollView>
    </View>
  );
};

export default Help;