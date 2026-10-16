import { View, Text, StatusBar, TextInput, TouchableOpacity, FlatList, Image, ActivityIndicator } from "react-native";
import React, { FC, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { NavigationProps } from "@/src/components/componentsType";
import { searchProfiles } from "@/src/services/profile/search";
import { Describe } from "@/src/components/systemComponentsLayout";

const Search: FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <SafeAreaView className="flex flex-1 bg-background">
      <View className="flex-1 bg-background p-screen gap-mid">
        <StatusBar hidden={false} translucent />
        <Text className="font-Poppinssemibold text-dark text-screenname">Search</Text>
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
              onPress={() => navigation.navigate("UserDetails", { profile: item })}
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
    </SafeAreaView>
  );
};

export default Search;
