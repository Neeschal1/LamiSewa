import { View, Text, StatusBar, FlatList, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import React, { FC, useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProps } from "@/src/components/componentsType";
import { fetchFollowing } from "@/src/services/privacy/follow";
import { fetchMemberProfile } from "@/src/services/profile/updateProfile";
import { Describe } from "@/src/components/systemComponentsLayout";

const Following: FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setUsers(await fetchFollowing());
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openProfile = async (u: any) => {
    if (!u?.profileid) return;
    try {
      const full = await fetchMemberProfile(u.profileid);
      navigation.navigate("MemberProfile", { profile: full });
    } catch {}
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom", "left", "right"]}>
      <StatusBar hidden={false} translucent />
      <View className="flex-1 bg-background">
        <View className="flex-row items-center gap-mid p-screen pb-2 pt-10">
          <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 rounded-full bg-[#ECEBFF] items-center justify-center">
            <Ionicons name="arrow-back" size={22} color="black" />
          </TouchableOpacity>
          <Text className="font-Poppinssemibold text-dark text-heading">
            Following{users.length > 0 ? ` (${users.length})` : ""}
          </Text>
        </View>
        {loading ? <ActivityIndicator size="large" className="mt-8" /> : null}
        {!loading && users.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Describe text="No following" />
          </View>
        ) : null}
        <FlatList
          data={users}
          keyExtractor={(item) => item.profileid}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => openProfile(item)}
              className="flex-row items-center gap-mid py-3 border-b border-darkvariant/10"
            >
              <Image
                source={{ uri: item.pic || "https://i.pinimg.com/736x/ff/14/a0/ff14a0b3a565567f03f47147f50b64e8.jpg" }}
                style={{ width: 56, height: 56, borderRadius: 28 }}
              />
              <View className="flex-1">
                <Text className="font-Poppinsmedium text-dark text-subheading">{item.name ?? item.username}</Text>
                <Describe text={`@${item.username}`} />
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Following;
