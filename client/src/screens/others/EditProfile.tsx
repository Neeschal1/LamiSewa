import { View, ScrollView, StatusBar, ActivityIndicator, Text } from "react-native";
import React, { FC, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import ToastManager, { Toast } from "toastify-react-native";
import {
  Description,
  InputFields,
  MainScreenName,
  PrimaryButton,
  Title,
  toastConfig,
} from "@/src/components/systemComponentsLayout";
import { NavigationProps } from "@/src/components/componentsType";
import { useProfile } from "@/src/profile/ProfileProvider";
import { updateOwnProfile } from "@/src/services/profile/updateProfile";

const Field = ({
  label,
  value,
  onChange,
  board = "default",
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  board?: "default" | "email-address" | "number-pad";
  placeholder?: string;
}) => (
  <View className="w-full gap-small">
    <Title text={label} />
    <InputFields plchldr={placeholder || label} state={value} setState={onChange} board={board} />
  </View>
);

const EditProfile: FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const { data, fetchProfile } = useProfile();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!data);

  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [marital, setMarital] = useState("");
  const [religion, setReligion] = useState("");
  const [occupation, setOccupation] = useState("");
  const [company, setCompany] = useState("");

  useEffect(() => {
    const load = async () => {
      const profile = data ?? (await fetchProfile());
      if (profile) {
        setUsername(profile?.profile?.username ?? "");
        setFullname(profile?.basic_info?.fullname ?? "");
        setNickname(profile?.basic_info?.nickname ?? "");
        setBio(profile?.basic_info?.bio ?? "");
        setGender(profile?.basic_info?.gender ?? "");
        setCity(profile?.personal_info?.current_city ?? "");
        setCountry(profile?.personal_info?.current_living_country ?? "");
        setMarital(profile?.personal_info?.maritalstatus ?? "");
        setReligion(profile?.additional_info?.religion ?? "");
        setOccupation(profile?.career_info?.occupation ?? "");
        setCompany(profile?.career_info?.company_or_organization_name ?? "");
      }
      setLoading(false);
    };
    load();
  }, [data, fetchProfile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateOwnProfile({
        username: username.trim(),
        basic_info: { fullname: fullname.trim(), nickname: nickname.trim(), bio: bio.trim(), gender: gender.trim() },
        personal_info: { current_city: city.trim(), current_living_country: country.trim(), maritalstatus: marital.trim() },
        additional_info: { religion: religion.trim() },
        career_info: { occupation: occupation.trim(), company_or_organization_name: company.trim() },
      });
      await fetchProfile(true);
      Toast.show({ type: "success", text1: "Profile updated.", position: "center", visibilityTime: 2500, autoHide: true });
      navigation.goBack();
    } catch (e: any) {
      Toast.show({
        type: "error",
        text1: e?.response?.data?.message ?? "Update failed.",
        position: "center",
        visibilityTime: 3000,
        autoHide: true,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar hidden={false} translucent />
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="p-screen gap-large">
          <MainScreenName text="Edit Profile" />
          <Description text={`Profile ID: ${data?.profile?.profileid ?? "-"} (cannot be changed)`} />
          <Field label="Username" value={username} onChange={setUsername} placeholder="@username" />
          <Field label="Full name" value={fullname} onChange={setFullname} />
          <Field label="Nickname" value={nickname} onChange={setNickname} />
          <Field label="Bio" value={bio} onChange={setBio} />
          <Field label="Gender" value={gender} onChange={setGender} />
          <Field label="City" value={city} onChange={setCity} />
          <Field label="Country" value={country} onChange={setCountry} />
          <Field label="Marital status" value={marital} onChange={setMarital} />
          <Field label="Religion" value={religion} onChange={setReligion} />
          <Field label="Occupation" value={occupation} onChange={setOccupation} />
          <Field label="Organization" value={company} onChange={setCompany} />
          {saving ? (
            <ActivityIndicator />
          ) : (
            <PrimaryButton text="Save changes" action={handleSave} />
          )}
          <Text className="font-Poppinsregular text-darkvariant text-center text-description">
            Saving refreshes your match embedding.
          </Text>
        </View>
      </ScrollView>
      <ToastManager config={toastConfig} />
    </SafeAreaView>
  );
};

export default EditProfile;
