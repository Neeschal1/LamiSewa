import { View, Text, Modal, Image } from "react-native";
import React, { FC, useState } from "react";
import {
  Description,
  MainScreenName,
  PrimaryButton,
} from "./systemComponentsLayout";
import { Ionicons } from "@expo/vector-icons";
import { ShowCustomModal } from "./componentsType";

const CustomModal: FC<ShowCustomModal> = ({showSuccessModal}) => {
  return (
    <Modal
      visible={showSuccessModal}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View
        className="flex-1 items-center justify-center"
        style={{
          backgroundColor: "rgba(0,0,0,0.8)",
          padding: 10,
        }}
      >
        <View className="bg-white py-4 mx-screen rounded-3xl w-full p-screen items-center gap-large">
          <View className="flex items-center gap-8">
            <Ionicons name="sad-outline" size={32} color="#FF000E" />
            <View className="mt-[-30px] w-full flex items-center">
              <MainScreenName text="Timeout" />
              <View className="mt-[-10px] w-full items-center">
                <Description text="You exceeded the time to choose a password. Signup your credentials again to continue!" />
              </View>
            </View>
            {/* <PrimaryButton
                text="Take me to Signup Screen"
                action={handleOkay}
              /> */}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;
