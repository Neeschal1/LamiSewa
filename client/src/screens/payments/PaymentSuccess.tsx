import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  Description,
  MainScreenName,
  SubTitle,
  Title,
} from "@/src/components/Texts";
import { Ionicons } from "@expo/vector-icons";
import React, { FC, useState } from "react";
import Modal from "react-native-modal";
import { PaymentOptionProps } from "./PaymentComponentTypes";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { NavigationProps } from "@/src/components/componentsType";

const screenheight = Dimensions.get("window").height;
const screenwidth = Dimensions.get("window").width;

const successLogo = require("@/src/assets/images/successPayment.png");

const PaymentSuccess = () => {

  const navigation = useNavigation<NavigationProps>()

  const handleReturnToHome = () => {
    navigation.navigate("MyTabs")
  }

  return (
    <SafeAreaView
      className="bg-background flex flex-1 items-center"
    >
      <View className="flex-1 flex items-center justify-between p-screen bg-background">
        <View className="flex items-center gap-mid">
          <Image className="h-20 w-20" source={successLogo} />
          <View className="flex items-center justify-center">
            <MainScreenName text="Payment Successful" />
            <View className="mt-[-10px]">
              <Description text="Successfully paid NRS 1000" />
            </View>
          </View>
        </View>

        <View className="w-full flex items-start gap-mid">
          <Title text="Transaction Details:" />
          <View className="flex items-center justify-center bg-white p-screen gap-mid rounded-2xl">
            <View className="flex w-full flex-row items-center justify-between">
              <Description text="Owner:" />
              <SubTitle text="Neeschal Pokharel" />
            </View>
            <View className="flex w-full flex-row items-center justify-between">
              <Description text="Transaction ID:" />
              <SubTitle text="9825376027" />
            </View>
            <View className="flex w-full flex-row items-center justify-between">
              <Description text="Package:" />
              <SubTitle text="Basic" />
            </View>
            <View className="flex w-full flex-row items-center justify-between">
              <Description text="Date/Time:" />
              <SubTitle text="2081-03-05/5:00 PM" />
            </View>
            <View className="flex w-full flex-row items-center justify-between">
              <Description text="Type of Transaction:" />
              <SubTitle text="eSewa" />
            </View>
            <View className="flex w-full flex-row items-center justify-between">
              <Description text="Nominal:" />
              <SubTitle text="NRS. 1000" />
            </View>
            <View className="flex w-full flex-row items-center justify-between">
              <Description text="Status:" />
              <SubTitle text="Success" />
            </View>
          </View>
        </View>

        <View className="flex gap-mid">
          <TouchableOpacity
            style={{
              height: screenheight * 0.061,
              width: screenwidth * 0.883,
            }}
            className="flex items-center justify-center border border-primaryblue rounded-2xl"
          >
            <Title text="Download Receipt" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: screenheight * 0.061,
              width: screenwidth * 0.883,
            }}
            onPress={handleReturnToHome}
            className="flex items-center justify-center bg-primaryblue rounded-2xl"
          >
            <Text className="text-white text-heading py-2 font-Poppinsmedium">Return to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PaymentSuccess;