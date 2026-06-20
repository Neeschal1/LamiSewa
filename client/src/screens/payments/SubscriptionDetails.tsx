import {
  View,
  Text,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Description,
  MainScreenName,
  SubTitle,
  TextualButton,
  Title,
} from "@/src/components/systemComponentsLayout";
import { SafeAreaView } from "react-native-safe-area-context";
import { Basicoffers, Premiumoffers, VIPoffers } from "./PaymentServices";

const screenheight = Dimensions.get("window").height;
const screenwidth = Dimensions.get("window").width;

const SubscriptionPlans = [
  {
    index: 1,
    duration: "1 month",
    price: "NRs. 1000/month",
    packagetype: "Basic",
    color: "#0066FF",
  },
  {
    index: 2,
    duration: "1/2 year",
    price: "NRs. 3000/0.5 years",
    packagetype: "Premium",
    color: "#C02DFA",
  },
  {
    index: 3,
    duration: "1 year",
    price: "NRs. 5000/year",
    packagetype: "VIP",
    color: "#000000",
  },
];

const SubscriptionDetails = () => {
  const [selectedPackage, setSelectedPackage] = useState(SubscriptionPlans[2]);

  const PackageDetails = () => {
    if (selectedPackage.packagetype === "VIP") {
      return VIPoffers.map((item) => (
        <View key={item.index} className="flex-row justify-center items-center">
          <View>{item.logo}</View>
          <Description text={item.value} />
        </View>
      ));
    } else if (selectedPackage.packagetype === "Basic") {
      return Basicoffers.map((item) => (
        <View key={item.index} className="flex-row justify-center items-center">
          <View>{item.logo}</View>
          <Description text={item.value} />
        </View>
      ));
    } else {
      return Premiumoffers.map((item) => (
        <View key={item.index} className="flex-row justify-center items-center">
          <View>{item.logo}</View>
          <Description text={item.value} />
        </View>
      ));
    }
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: selectedPackage.color }}
      className="flex-1"
    >
      <StatusBar hidden translucent />
      <View className="flex-1 items-center justify-start bg-background">
        <View
          style={{
            backgroundColor: selectedPackage.color,
            height: screenheight * 0.2,
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
          }}
          className="items-center justify-center p-screen w-full"
        >
          <Text className="font-Poppinssemibold text-background text-screenname">
            {selectedPackage.packagetype}
          </Text>
          <Text className="font-Poppinsregular text-background text-center text-description">
            Get access to view full user's profile, unlimited textings and many
            more...
          </Text>
        </View>

        <View className="flex items-start justify-center p-screen gap-extralarge">
          <View className="flex items-start gap-small">
            <Title text="What's included?" />
            {PackageDetails()}
          </View>

          <View className="flex gap-mid w-full">
            {SubscriptionPlans.map((item) => (
              <TouchableOpacity
                key={item.index}
                onPress={() => setSelectedPackage(item)}
                style={{
                  borderColor:
                    selectedPackage.index === item.index
                      ? item.color
                      : "#CBCBCB",
                  borderWidth: selectedPackage.index === item.index ? 2 : 1,
                }}
                className="rounded-xl p-4 w-full flex-row items-center justify-between"
              >
                <View>
                  <Title text={item.duration} />
                  <Description text={item.price} />
                </View>
                <View className="flex-row items-center gap-2">
                  <SubTitle text={item.packagetype} />
                  <Ionicons
                    name={
                      selectedPackage.index === item.index
                        ? "radio-button-on"
                        : "radio-button-off"
                    }
                    size={20}
                    color={
                      selectedPackage.index === item.index
                        ? item.color
                        : "#CBCBCB"
                    }
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={() =>
              console.log("Upgrading to:", selectedPackage.packagetype)
            }
            style={{
              height: screenheight * 0.061,
              width: screenwidth * 0.883,
              backgroundColor: selectedPackage.color,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View className="flex flex-row gap-mid">
              <Ionicons name="diamond-outline" color="white" size={24} />
              <Text className="text-white text-heading py-2 font-Poppinsmedium">
                Upgrade to {selectedPackage.packagetype}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SubscriptionDetails;
