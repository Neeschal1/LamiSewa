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
  const [paymentItem, setPaymentItem] = useState(InternationalPaymentMethod[0]);

  const handlePayment = () => {
    console.log(paymentItem["paymentName"])
  }

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
        <View className="flex flex-row justify-between items-center mb-6">
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

        <View className="flex gap-extralarge">
          <View className="flex gap-mid">
            <Title text="Choose Payment method" />
            {InternationalPaymentMethod.map((item) => (
              <TouchableOpacity
                style={{
                  backgroundColor:
                    paymentItem.paymentName === item.paymentName
                      ? item.bgcolor
                      : "transparent",
                }}
                className="rounded-2xl"
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
          </View>
          <View className="flex gap-mid">
            <Title text="Or, Pay locally through:" />
            <View className="flex-row flex-wrap justify-between">
              {NationalPaymentMethod.map((item) => (
                <TouchableOpacity
                  key={item.index}
                  onPress={() => setPaymentItem(item)}
                  style={{
                    backgroundColor:
                      paymentItem.paymentName === item.paymentName
                        ? item.bgcolor
                        : "transparent",
                  }}
                  className="w-[30%] mb-3 rounded-2xl"
                >
                  <View className="py-3 px-4 items-center border border-darkvariant/30 rounded-2xl gap-small">
                    <Image source={item.logo} resizeMode="contain" />
                    <Text className="font-Poppinsregular text-dark text-sm">
                      {item.paymentName}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        <TouchableOpacity
        onPress={handlePayment}
          className="rounded-2xl items-center justify-center"
          style={{
            height: screenheight * 0.061,
            width: screenwidth * 0.883,
            backgroundColor: paymentItem.btncolor,
          }}
        >
          <View className="flex flex-row gap-mid justify-center items-center">
            <Ionicons name="diamond-outline" color="white" size={22} />
            <Text className="text-background text-subheading font-Poppinsmedium">
              Upgrade to {paymentItem.paymentName}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default PaymentOption;
