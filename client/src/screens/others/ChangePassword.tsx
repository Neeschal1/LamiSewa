import { View, ScrollView, StatusBar, ActivityIndicator } from "react-native";
import React, { FC, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import ToastManager, { Toast } from "toastify-react-native";
import {
  ErrorText,
  InputPassword,
  MainScreenName,
  PrimaryButton,
  Title,
  toastConfig,
} from "@/src/components/systemComponentsLayout";
import { NavigationProps } from "@/src/components/componentsType";
import { changePassword } from "@/src/services/accounts/changePassword";

const ChangePassword: FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [seeCurrent, setSeeCurrent] = useState(false);
  const [seeNext, setSeeNext] = useState(false);
  const [seeConfirm, setSeeConfirm] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setError("");
    if (!current || !next || !confirm) {
      setError("Fill in all three fields.");
      return;
    }
    if (next !== confirm) {
      setError("New password and confirmation do not match.");
      return;
    }
    if (next.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    setSaving(true);
    try {
      await changePassword(current, next);
      Toast.show({ type: "success", text1: "Password updated.", position: "center", visibilityTime: 2500, autoHide: true });
      navigation.goBack();
    } catch (e: any) {
      setError(e?.response?.data?.Message ?? "Update failed. Check your current password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom", "left", "right"]}>
      <StatusBar hidden={false} translucent />
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="p-screen pt-12 gap-large">
          <MainScreenName text="Change Password" />
          <View className="gap-small">
            <Title text="Current password" />
            <InputPassword plchldr="***********" state={current} setState={setCurrent} board="default" visibility={seeCurrent} setVisibility={setSeeCurrent} />
          </View>
          <View className="gap-small">
            <Title text="New password" />
            <InputPassword plchldr="***********" state={next} setState={setNext} board="default" visibility={seeNext} setVisibility={setSeeNext} />
          </View>
          <View className="gap-small">
            <Title text="Confirm new password" />
            <InputPassword plchldr="***********" state={confirm} setState={setConfirm} board="default" visibility={seeConfirm} setVisibility={setSeeConfirm} />
          </View>
          {error ? <ErrorText text={error} /> : null}
          {saving ? <ActivityIndicator /> : <PrimaryButton text="Update password" action={handleSave} />}
        </View>
      </ScrollView>
      <ToastManager config={toastConfig} />
    </SafeAreaView>
  );
};

export default ChangePassword;
