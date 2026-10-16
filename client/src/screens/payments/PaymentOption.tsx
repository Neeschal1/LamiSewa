import { MainScreenName, SubTitle, Title } from "@/src/components/Texts";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, TouchableOpacity, Text, Image, Dimensions } from "react-native";
import { LottieLoadingAnimation } from "@/src/constants/LoadingAnimation";
import Modal from "react-native-modal";
import * as WebBrowser from "expo-web-browser";
import {
  InternationalPaymentMethod,
  NationalPaymentMethod,
  SubscriptionPlans
} from "./PaymentServices";
import { PaymentOptionProps } from "./PaymentComponentTypes"
import { useNavigation } from "expo-router";
import { NavigationProps } from "@/src/components/componentsType";
import { createSubscription } from "@/src/services/payments/subscription";
import { StoreStringDataAsync } from "@/src/storage/ProfileDataAsync";

const screenheight = Dimensions.get("window").height;
const screenwidth = Dimensions.get("window").width;

const PACKAGE_AMOUNTS: Record<string, number> = {
  Basic: 1000,
  Premium: 3000,
  VIP: 5000,
};

const normalizePaidVia = (name: string) => {
  if (name === "Master Card") return "Mastercard";
  if (name === "KhaltiIME") return "Khalti";
  if (name === "Connect IPS") return "ConnectIPS";
  return name;
};

const PaymentOption = ({
  isVisible,
  onClose,
  packageName,
  color,
}: PaymentOptionProps) => {
  const [paymentItem, setPaymentItem] = useState(InternationalPaymentMethod[0]);
  const [selectedPackage, setSelectedPackage] = useState(SubscriptionPlans[2]);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [paying, setPaying] = useState<boolean>(false);
  const [payError, setPayError] = useState<string>("");

  const navigation = useNavigation<NavigationProps>()

  const activePlan = SubscriptionPlans.find((p) => p.packagetype === packageName) ?? selectedPackage;

  const handlePayment = async () => {
    setPaying(true);
    setPayError("");
    try {
      const data = await createSubscription({
        package_type: activePlan.packagetype,
        transaction_id: Math.floor(Date.now() / 1000),
        package_amount: PACKAGE_AMOUNTS[activePlan.packagetype] ?? 1000,
        paid_via: normalizePaidVia(paymentItem["paymentName"]),
        payment_status: "Paid",
        package_status: "Completed",
      });


      if (data?.URL) {
        await WebBrowser.openBrowserAsync(data.URL);
      }


      await StoreStringDataAsync("SubscriptionStatusAfterBuildingUpProfile", "Complete");
      setModalVisible(true);
      onClose();
      navigation.navigate("PaymentSuccess");
    } catch (e: any) {
      console.log("Payment error:", e?.response?.data ?? e);
      setPayError("Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  }

  const closeModal = () => {
    setModalVisible(false);
  };

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
        {payError ? (
          <Text className="font-Poppinsregular text-primaryred text-center">{payError}</Text>
        ) : null}
        <TouchableOpacity
        onPress={handlePayment}
        disabled={paying}
          className="rounded-2xl items-center justify-center"
          style={{
            height: screenheight * 0.061,
            width: screenwidth * 0.883,
            backgroundColor: paymentItem.btncolor,
            opacity: paying ? 0.6 : 1,
          }}
        >
          <View className="flex flex-row gap-mid justify-center items-center">
            {paying ? (
              <Ionicons name="diamond-outline" color="white" size={22} />
            ) : (
              <Ionicons name="diamond-outline" color="white" size={22} />
            )}
            <Text className="text-background text-subheading font-Poppinsmedium">
              {paying ? "Processing..." : `Upgrade to ${paymentItem.paymentName}`}
            </Text>
          </View>
        </TouchableOpacity>
        {paying ? <LottieLoadingAnimation /> : null}
      </View>
    </Modal>
  );
};

export default PaymentOption;
