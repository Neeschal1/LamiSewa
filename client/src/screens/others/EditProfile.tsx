import { View, ScrollView, StatusBar, Text } from "react-native";
import { LottieLoadingAnimation } from "@/src/constants/LoadingAnimation";
import React, { FC, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import ToastManager, { Toast } from "toastify-react-native";
import {
  CustomDropdown,
  Description,
  InputFields,
  MainScreenName,
  PrimaryButton,
  Title,
  toastConfig,
} from "@/src/components/systemComponentsLayout";
import {
  CommunityItems,
  DegreeItems,
  DietItems,
  GenderOption,
  GotraItems,
  HeightItems,
  MaritalStatusItems,
  ProfileOptions,
  ReligionItems,
  ResidencyStatusItems,
  WeightItems,
  WorkingItems,
} from "@/src/utils/objects";
import { DropdownItem } from "@/src/components/componentsType";
import { NavigationProps } from "@/src/components/componentsType";
import { useProfile } from "@/src/profile/ProfileProvider";
import { updateOwnProfile } from "@/src/services/profile/updateProfile";
import { clearCachedMatches } from "@/src/services/matches/matchCache";

const Field = ({
  label,
  value,
  onChange,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => (
  <View className="w-full gap-small">
    <Title text={label} />
    <InputFields plchldr={placeholder || label} state={value} setState={onChange} board="default" />
  </View>
);

const EditDropdown = ({
  label,
  value,
  onChange,
  choices,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  choices: DropdownItem[];
}) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<DropdownItem[]>(choices);
  return (
    <View className="w-full gap-small">
      <Title text={label} />
      <CustomDropdown
        open={open}
        value={value || null}
        items={items}
        setOpen={setOpen}
        setValue={(v: any) => onChange(typeof v === "function" ? v(value) : v ?? "")}
        setItems={setItems}
      />
    </View>
  );
};

const clean = (obj: Record<string, string>) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v.trim() !== ""));

const EditProfile: FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const { data, fetchProfile } = useProfile();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!data);

  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [handler, setHandler] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [marital, setMarital] = useState("");
  const [gotra, setGotra] = useState("");
  const [residency, setResidency] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [religion, setReligion] = useState("");
  const [community, setCommunity] = useState("");
  const [diet, setDiet] = useState("");
  const [qualification, setQualification] = useState("");
  const [college, setCollege] = useState("");
  const [working, setWorking] = useState("");
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
        setHandler(profile?.basic_info?.profile_handler ?? "");
        const g = profile?.basic_info?.gender ?? "";
        setGender(g === "OTHERS" ? "OTHER" : g);
        setCity(profile?.personal_info?.current_city ?? "");
        setCountry(profile?.personal_info?.current_living_country ?? "");
        setMarital(profile?.personal_info?.maritalstatus ?? "");
        setGotra(profile?.personal_info?.gotra ?? "");
        setResidency(profile?.personal_info?.residency_status ?? "");
        setHeight(profile?.additional_info?.height ?? "");
        setWeight(profile?.additional_info?.weight ?? "");
        setReligion(profile?.additional_info?.religion ?? "");
        setCommunity(profile?.additional_info?.community ?? "");
        setDiet(profile?.additional_info?.diet ?? "");
        setQualification(profile?.career_info?.highest_qualification ?? "");
        setCollege(profile?.career_info?.college_name ?? "");
        setWorking(profile?.career_info?.working_as ?? "");
        setOccupation(profile?.career_info?.occupation ?? "");
        setCompany(profile?.career_info?.company_or_organization_name ?? "");
      }
      setLoading(false);
    };
    load();
  }, [data, fetchProfile]);

  const handleSave = async () => {
    if (!username.trim()) {
      Toast.show({ type: "error", text1: "Username cannot be empty.", position: "center", visibilityTime: 2500, autoHide: true });
      return;
    }
    setSaving(true);
    try {
      await updateOwnProfile({
        username: username.trim(),
        basic_info: clean({ fullname, nickname, bio, profile_handler: handler, gender }),
        personal_info: clean({ current_city: city, current_living_country: country, maritalstatus: marital, gotra, residency_status: residency }),
        additional_info: clean({ height, weight, religion, community, diet }),
        career_info: clean({ highest_qualification: qualification, college_name: college, working_as: working, occupation, company_or_organization_name: company }),
      });
      await fetchProfile(true);
      clearCachedMatches();
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
        <LottieLoadingAnimation />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom", "left", "right"]}>
      <StatusBar hidden={false} translucent />
      <View className="p-screen pt-12">
        <MainScreenName text="Edit Profile" />
        <Description text={`Profile ID: ${data?.profile?.profileid ?? "-"} (cannot be changed)`} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="px-screen pb-4 gap-large">
          <Field label="Username" value={username} onChange={setUsername} placeholder="@username" />
          <Field label="Full name" value={fullname} onChange={setFullname} />
          <Field label="Nickname" value={nickname} onChange={setNickname} />
          <Field label="Bio" value={bio} onChange={setBio} />
          <EditDropdown label="Profile handler" value={handler} onChange={setHandler} choices={ProfileOptions.map((o) => ({ label: o.option, value: o.option }))} />
          <EditDropdown label="Gender" value={gender} onChange={setGender} choices={GenderOption.map((o) => ({ label: o.option, value: o.value === "OTHERS" ? "OTHER" : o.value }))} />
          <Field label="City" value={city} onChange={setCity} />
          <Field label="Country" value={country} onChange={setCountry} />
          <EditDropdown label="Marital status" value={marital} onChange={setMarital} choices={MaritalStatusItems} />
          <EditDropdown label="Gotra" value={gotra} onChange={setGotra} choices={GotraItems} />
          <EditDropdown label="Residency status" value={residency} onChange={setResidency} choices={ResidencyStatusItems} />
          <EditDropdown label="Height" value={height} onChange={setHeight} choices={HeightItems} />
          <EditDropdown label="Weight" value={weight} onChange={setWeight} choices={WeightItems} />
          <EditDropdown label="Religion" value={religion} onChange={setReligion} choices={ReligionItems} />
          <EditDropdown label="Community" value={community} onChange={setCommunity} choices={CommunityItems} />
          <EditDropdown label="Diet" value={diet} onChange={setDiet} choices={DietItems} />
          <EditDropdown label="Highest qualification" value={qualification} onChange={setQualification} choices={DegreeItems} />
          <Field label="College name" value={college} onChange={setCollege} />
          <EditDropdown label="Working as" value={working} onChange={setWorking} choices={WorkingItems} />
          <Field label="Occupation" value={occupation} onChange={setOccupation} />
          <Field label="Organization" value={company} onChange={setCompany} />
        </View>
      </ScrollView>
      <View className="px-screen pb-screen pt-2 bg-background gap-small border-t border-darkvariant/10">
        {saving ? <LottieLoadingAnimation /> : <PrimaryButton text="Save changes" action={handleSave} />}
        <Text className="font-Poppinsregular text-darkvariant text-center text-description">
          Saving refreshes your match embeddings.
        </Text>
      </View>
      <ToastManager config={toastConfig} />
    </SafeAreaView>
  );
};

export default EditProfile;
