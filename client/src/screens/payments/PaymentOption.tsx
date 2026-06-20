import { MainScreenName, SubTitle, Title } from "@/src/components/Texts";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, TouchableOpacity, Text, Image, Dimensions } from "react-native";
import Modal from "react-native-modal";
import {
  InternationalPaymentMethod,
  NationalPaymentMethod,
} from "./PaymentServices";

interface PaymentOptionProps {
  isVisible: boolean;
  onClose: () => void;
  packageName: string;
  color: string;
}

const screenheight = Dimensions.get("window").height;
const screenwidth = Dimensions.get("window").width;

const PaymentOption = ({
  isVisible,
  onClose,
  packageName,
  color,
}: PaymentOptionProps) => {
  const [paymentOption, setPaymentOption] = useState("");
  const [paymentItem, setPaymentItem] = useState(InternationalPaymentMethod[0]);

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={{
        justifyContent: "flex-end",
        margin: 0,
      }}
    >
      <View
        style={{ borderTopEndRadius: 20, borderTopLeftRadius: 20 }}
        className="p-screen bg-background rounded-4xl gap-large"
      >
        <View className="flex flex-row justify-between items-center mb-20">
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={28} color="black" />
          </TouchableOpacity>
          <Text
            className="font-Poppinssemibold text-heading"
            style={{
              color: color,
            }}
          >
            {packageName} Package
          </Text>
          <View />
        </View>

        <Title text="Choose Payment method" />
        {InternationalPaymentMethod.map((item) => (
          <TouchableOpacity
            onPress={() => {
              setPaymentItem(item);
            }}
            key={item.index}
          >
            <View className="flex flex-row p-screen items-center gap-mid border border-darkvariant/30 rounded-2xl">
              <Image source={item.logo} />
              <SubTitle text={item.paymentName} />
            </View>
          </TouchableOpacity>
        ))}
        <Title text="Or, Pay locally through:" />
        <View className="flex flex-row gap-mid justify-between">
          {NationalPaymentMethod.map((item) => (
            <TouchableOpacity
              onPress={() => {
                setPaymentItem(item);
              }}
              key={item.index}
            >
              <View className="flex py-3 pl-4 items-center gap-mid border border-darkvariant/30 rounded-2xl">
                <Image source={item.logo} />
                <SubTitle text={item.paymentName} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          className="rounded-2xl  items-center justify-center"
          style={{
            height: screenheight * 0.061,
            width: screenwidth * 0.883,
            backgroundColor: paymentItem.bgcolor,
          }}
        >
          <View className="flex flex-row gap-mid">
            <Ionicons name="diamond-outline" color="white" size={24} />
            <Text className="text-white text-heading py-2 font-Poppinsmedium">
              Upgrade to {paymentItem.paymentName}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default PaymentOption;
