import { View, Text, StatusBar, TextInput, TouchableOpacity, FlatList, Image, ActivityIndicator, Modal } from "react-native";
import React, { FC, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProps } from "@/src/components/componentsType";
import { searchProfiles } from "@/src/services/profile/search";
import { fetchMemberProfile } from "@/src/services/profile/updateProfile";
import { Describe } from "@/src/components/systemComponentsLayout";

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

const Search: FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [scanError, setScanError] = useState("");
  const [permission, requestPermission] = useCameraPermissions();

  const runSearch = async () => {
    setLoading(true);
    try {
      const data = await searchProfiles({ q, city, gender });
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
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

  return (
    <SafeAreaView className="flex flex-1 bg-background">
      <View className="flex-1 bg-background p-screen gap-mid">
        <StatusBar hidden={false} translucent />
        <View className="flex-row items-center justify-between">
          <Text className="font-Poppinssemibold text-dark text-screenname">Search</Text>
          <TouchableOpacity onPress={openScanner} className="w-11 h-11 rounded-full bg-primaryblue items-center justify-center">
            <Ionicons name="qr-code-outline" size={22} color="white" />
          </TouchableOpacity>
        </View>
        {scanError ? <Describe text={scanError} /> : null}
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Username"
          className="border border-darkvariant/30 rounded-2xl px-4 py-3 font-Poppinsregular"
        />
        <View className="flex-row gap-mid">
          <TextInput
            value={city}
            onChangeText={setCity}
            placeholder="City"
            className="flex-1 border border-darkvariant/30 rounded-2xl px-4 py-3 font-Poppinsregular"
          />
          <TextInput
            value={gender}
            onChangeText={setGender}
            placeholder="Gender"
            className="flex-1 border border-darkvariant/30 rounded-2xl px-4 py-3 font-Poppinsregular"
          />
        </View>
        <TouchableOpacity onPress={runSearch} className="bg-primaryred rounded-2xl py-3 items-center">
          <Text className="font-Poppinsmedium text-background">Search</Text>
        </TouchableOpacity>
        {loading ? <ActivityIndicator /> : null}
        <FlatList
          data={results}
          keyExtractor={(item, i) => item?.profileid ?? String(i)}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("MemberProfile", { profile: item })}
              className="flex-row items-center gap-mid py-2 border-b border-darkvariant/10"
            >
              <Image
                source={{ uri: item?.basic_info?.profile_picture ?? "https://i.pinimg.com/736x/ff/14/a0/ff14a0b3a565567f03f47147f50b64e8.jpg" }}
                style={{ width: 52, height: 52, borderRadius: 26 }}
              />
              <View className="flex-1">
                <Text className="font-Poppinsmedium text-dark">{item?.basic_info?.fullname ?? item?.username}</Text>
                <Describe text={item?.city ?? ""} />
              </View>
            </TouchableOpacity>
          )}
        />
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
