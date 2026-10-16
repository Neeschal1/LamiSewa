import { View, Text, StatusBar, TextInput, TouchableOpacity, FlatList, Image, Modal, ScrollView } from "react-native";
import { LottieLoadingAnimation } from "@/src/constants/LoadingAnimation";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProps } from "@/src/components/componentsType";
import { fetchRandomMember, searchProfiles } from "@/src/services/profile/search";
import { fetchMemberProfile } from "@/src/services/profile/updateProfile";
import { fetchFollowing, followUser, unfollowUser } from "@/src/services/privacy/follow";
import { Describe, Title } from "@/src/components/systemComponentsLayout";
import { CustomDropdown } from "@/src/components/InputFields";
import { DropdownItem } from "@/src/components/componentsType";
import {
  CommunityItems,
  DietItems,
  MangalikItems,
  MaritalStatusItems,
  ReligionItems,
} from "@/src/utils/objects";

const FALLBACK_PIC = "https://i.pinimg.com/736x/ff/14/a0/ff14a0b3a565567f03f47147f50b64e8.jpg";

const parseProfileId = (raw: string): string | null => {
  const value = raw.trim();
  if (/^BB00\d+$/.test(value)) return value;
  const link = value.match(/lamisewa:\/\/profile\/([A-Za-z0-9]+)/);
  if (link) return link[1];
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed.profileid === "string") return parsed.profileid;
  } catch {}
  return null;
};

const AgeRange = ({
  min,
  max,
  setMin,
  setMax,
}: {
  min: number;
  max: number;
  setMin: (v: number) => void;
  setMax: (v: number) => void;
}) => (
  <View className="w-full gap-small">
    <Title text="Age Ranging" />
    <Text className="font-Poppinsregular text-dark text-description">
      from {min} to {max}
    </Text>
    <View>
      <Text className="font-Poppinsregular text-darkvariant text-description">From</Text>
      <Slider
        minimumValue={18}
        maximumValue={70}
        step={1}
        value={min}
        onValueChange={(v) => setMin(Math.min(Math.round(v), max))}
        minimumTrackTintColor="#FC404E"
        maximumTrackTintColor="#CBCBCB"
      />
    </View>
    <View>
      <Text className="font-Poppinsregular text-darkvariant text-description">To</Text>
      <Slider
        minimumValue={18}
        maximumValue={70}
        step={1}
        value={max}
        onValueChange={(v) => setMax(Math.max(Math.round(v), min))}
        minimumTrackTintColor="#4987F6"
        maximumTrackTintColor="#CBCBCB"
      />
    </View>
  </View>
);

const Drop = ({
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

const GENDERS = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Others", value: "OTHERS" },
];

const Search: FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const [mode, setMode] = useState<"quick" | "advanced" | "idname">("quick");
  const [ageMin, setAgeMin] = useState(20);
  const [ageMax, setAgeMax] = useState(40);
  const [community, setCommunity] = useState("");
  const [country, setCountry] = useState("");
  const [gender, setGender] = useState("");
  const [marital, setMarital] = useState("");
  const [religion, setReligion] = useState("");
  const [livingIn, setLivingIn] = useState("");
  const [education, setEducation] = useState("");
  const [diet, setDiet] = useState("");
  const [mangalik, setMangalik] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [idResults, setIdResults] = useState<any[]>([]);
  const [idLoading, setIdLoading] = useState(false);
  const [recommended, setRecommended] = useState<any | null>(null);
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [scanError, setScanError] = useState("");
  const [permission, requestPermission] = useCameraPermissions();
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const following = await fetchFollowing();
        setFollowingIds(following.map((u: any) => u.profileid));
      } catch {}
      try {
        setRecommended(await fetchRandomMember());
      } catch {}
    };
    init();
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, []);

  const runQuick = async () => {
    setLoading(true);
    try {
      setResults(await searchProfiles({ age_min: ageMin, age_max: ageMax, community, country }));
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const runAdvanced = async () => {
    setLoading(true);
    try {
      setResults(
        await searchProfiles({
          age_min: ageMin,
          age_max: ageMax,
          gender,
          maritalstatus: marital,
          religion,
          living_in: livingIn,
          education,
          diet,
          mangalik,
        })
      );
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const runIdSearch = useCallback(async (text: string) => {
    const query = text.trim();
    if (!query) {
      setIdResults([]);
      return;
    }
    setIdLoading(true);
    try {
      setIdResults(await searchProfiles({ q: query }));
    } catch {
      setIdResults([]);
    } finally {
      setIdLoading(false);
    }
  }, []);

  const onIdChange = (text: string) => {
    setQ(text);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => runIdSearch(text), 2000);
  };

  const openProfile = async (item: any) => {
    try {
      const full = item?.basic_info && item?.personal_info
        ? item
        : await fetchMemberProfile(item.profileid);
      navigation.navigate("MemberProfile", { profile: full });
    } catch {}
  };

  const toggleFollow = async (item: any) => {
    if (!item?.profileid) return;
    try {
      if (followingIds.includes(item.profileid)) {
        await unfollowUser(item.profileid);
        setFollowingIds((prev) => prev.filter((id) => id !== item.profileid));
      } else {
        await followUser(item.profileid);
        setFollowingIds((prev) => [...prev, item.profileid]);
      }
    } catch {}
  };

  const openScanner = async () => {
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        setScanError("Camera permission is needed to scan profile codes.");
        return;
      }
    }
    setScanError("");
    setScanned(false);
    setScanning(true);
  };

  const handleScan = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    const profileid = parseProfileId(data);
    if (!profileid) {
      setScanError("This code is not a LamiSewa profile.");
      setScanning(false);
      return;
    }
    try {
      const full = await fetchMemberProfile(profileid);
      setScanning(false);
      navigation.navigate("MemberProfile", { profile: full });
    } catch {
      setScanError("Profile not found.");
      setScanning(false);
    }
  };

  const ResultRow = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => openProfile(item)}
      className="flex-row items-center gap-mid py-2 border-b border-darkvariant/10"
    >
      <Image
        source={{ uri: item?.basic_info?.profile_picture ?? FALLBACK_PIC }}
        style={{ width: 52, height: 52, borderRadius: 26 }}
      />
      <View className="flex-1">
        <Text className="font-Poppinsmedium text-dark">{item?.basic_info?.fullname ?? item?.username}</Text>
        <Describe text={item?.city ?? ""} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex flex-1 bg-background" edges={["bottom", "left", "right"]}>
      <View className="flex-1 bg-background p-screen pt-12 gap-mid">
        <StatusBar hidden={false} translucent />
        <View className="flex-row items-center justify-between">
          <Text className="font-Poppinssemibold text-dark text-screenname">Search</Text>
          <TouchableOpacity onPress={openScanner} className="w-11 h-11 rounded-full bg-primaryblue items-center justify-center">
            <Ionicons name="qr-code-outline" size={22} color="white" />
          </TouchableOpacity>
        </View>
        {scanError ? <Describe text={scanError} /> : null}
        <View className="flex-row gap-mid">
          {(["quick", "advanced", "idname"] as const).map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => setMode(m)}
              className={`px-5 py-2 rounded-full ${mode === m ? "bg-primaryred" : "bg-[#ECEBFF]"}`}
            >
              <Text className={`font-Poppinsmedium ${mode === m ? "text-background" : "text-dark"}`}>
                {m === "quick" ? "Quick" : m === "advanced" ? "Advanced" : "ID/Name"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {mode !== "idname" ? (
          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            <View className="gap-large pb-4">
              <Text className="font-Poppinsmedium text-dark text-subheading">Search users based on</Text>
              <AgeRange min={ageMin} max={ageMax} setMin={setAgeMin} setMax={setAgeMax} />
              {mode === "quick" ? (
                <>
                  <Drop label="Community" value={community} onChange={setCommunity} choices={CommunityItems} />
                  <View className="w-full gap-small">
                    <Title text="Currently living country" />
                    <TextInput
                      value={country}
                      onChangeText={setCountry}
                      placeholder="Country"
                      className="border border-darkvariant/30 rounded-2xl px-4 py-3 font-Poppinsregular"
                    />
                  </View>
                  <TouchableOpacity onPress={runQuick} className="bg-primaryred rounded-2xl py-3 items-center">
                    <Text className="font-Poppinsmedium text-background">Search</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <View className="w-full gap-small">
                    <Title text="Gender" />
                    <View className="flex-row gap-mid">
                      {GENDERS.map((g) => (
                        <TouchableOpacity
                          key={g.value}
                          onPress={() => setGender(gender === g.value ? "" : g.value)}
                          className={`px-5 py-2 rounded-full ${gender === g.value ? "bg-primaryblue" : "bg-[#ECEBFF]"}`}
                        >
                          <Text className={`font-Poppinsmedium ${gender === g.value ? "text-background" : "text-dark"}`}>
                            {g.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  <Drop label="Marital Status" value={marital} onChange={setMarital} choices={MaritalStatusItems} />
                  <Drop label="Religion" value={religion} onChange={setReligion} choices={ReligionItems} />
                  <View className="w-full gap-small">
                    <Title text="Living in" />
                    <TextInput
                      value={livingIn}
                      onChangeText={setLivingIn}
                      placeholder="Galway, Ireland"
                      className="border border-darkvariant/30 rounded-2xl px-4 py-3 font-Poppinsregular"
                    />
                  </View>
                  <View className="w-full gap-small">
                    <Title text="Education" />
                    <TextInput
                      value={education}
                      onChangeText={setEducation}
                      placeholder="eg: MBA"
                      className="border border-darkvariant/30 rounded-2xl px-4 py-3 font-Poppinsregular"
                    />
                  </View>
                  <Drop label="Diet" value={diet} onChange={setDiet} choices={DietItems} />
                  <Drop label="Mangalik" value={mangalik} onChange={setMangalik} choices={MangalikItems} />
                  <TouchableOpacity onPress={runAdvanced} className="bg-primaryred rounded-2xl py-3 items-center">
                    <Text className="font-Poppinsmedium text-background">Search</Text>
                  </TouchableOpacity>
                </>
              )}
              {loading ? <LottieLoadingAnimation /> : null}
              <FlatList
                data={results}
                scrollEnabled={false}
                keyExtractor={(item, i) => item?.profileid ?? String(i)}
                renderItem={({ item }) => <ResultRow item={item} />}
              />
            </View>
          </ScrollView>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            <View className="gap-mid pb-4">
              <View className="flex-row gap-mid items-center">
                <TextInput
                  value={q}
                  onChangeText={onIdChange}
                  placeholder="User ID or Name"
                  className="flex-1 border border-darkvariant/30 rounded-2xl px-4 py-3 font-Poppinsregular"
                />
                <TouchableOpacity onPress={() => runIdSearch(q)} className="w-12 h-12 rounded-full bg-primaryred items-center justify-center">
                  <Ionicons name="search" size={22} color="white" />
                </TouchableOpacity>
              </View>
              {idLoading ? <LottieLoadingAnimation /> : null}
              {idResults.map((item: any) => (
                <ResultRow key={item.profileid} item={item} />
              ))}
              <Text className="font-Poppinsmedium text-dark text-subheading mt-2">Recommended</Text>
              {recommended ? (
                <TouchableOpacity
                  onPress={() => openProfile(recommended)}
                  className="flex-row items-center gap-mid bg-[#ECEBFF] rounded-2xl px-4 py-3"
                >
                  <Image
                    source={{ uri: recommended?.basic_info?.profile_picture ?? FALLBACK_PIC }}
                    style={{ width: 56, height: 56, borderRadius: 28 }}
                  />
                  <View className="flex-1">
                    <Text className="font-Poppinsmedium text-dark text-subheading">
                      {recommended?.basic_info?.fullname ?? recommended?.username}
                    </Text>
                    <Text className="font-Poppinsregular text-darkvariant text-description">
                      {recommended?.basic_info?.nickname ?? `@${recommended?.username}`}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => toggleFollow(recommended)}
                    className={`px-5 py-2 rounded-full ${followingIds.includes(recommended.profileid) ? "border border-primaryblue" : "bg-primaryred"}`}
                  >
                    <Text className={`font-Poppinsmedium ${followingIds.includes(recommended.profileid) ? "text-primaryblue" : "text-background"}`}>
                      {followingIds.includes(recommended.profileid) ? "Following" : "Follow"}
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ) : null}
            </View>
          </ScrollView>
        )}
      </View>
      <Modal visible={scanning} animationType="slide" onRequestClose={() => setScanning(false)}>
        <SafeAreaView className="flex-1 bg-black">
          <View className="flex-1">
            <CameraView
              style={{ flex: 1 }}
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
              onBarcodeScanned={handleScan}
            />
            <TouchableOpacity
              onPress={() => setScanning(false)}
              className="absolute top-12 right-6 w-11 h-11 rounded-full bg-black/60 items-center justify-center"
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            <View className="absolute bottom-12 w-full items-center">
              <Text className="font-Poppinsregular text-white text-description">Point at a LamiSewa profile code</Text>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default Search;
