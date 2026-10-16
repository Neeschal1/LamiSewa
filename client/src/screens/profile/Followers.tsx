import { View, Text, StatusBar, FlatList, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import React, { FC, useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/src/components/componentsType";
import { fetchFollowers } from "@/src/services/privacy/follow";
import { fetchMemberProfile } from "@/src/services/profile/updateProfile";
import { Describe } from "@/src/components/systemComponentsLayout";

const Followers: FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setUsers(await fetchFollowers());
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const openProfile = async (u: any) => {
    if (!u?.profileid) return;
    try {
      const full = await fetchMemberProfile(u.profileid);
      navigation.navigate("UserDetails", { profile: full });
    } catch {}
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar hidden={false} translucent />
      <View className="flex-1 bg-background p-screen gap-mid">
        <Text className="font-Poppinssemibold text-dark text-screenname">
          Followers{users.length > 0 ? ` (${users.length})` : ""}
        </Text>
        {loading ? <ActivityIndicator size="large" /> : null}
        {!loading && users.length === 0 ? <Describe text="No followers" /> : null}
        <FlatList
          data={users}
          keyExtractor={(item) => item.profileid}
          showsVerticalScrollIndicator={false}
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

export default Followers;
