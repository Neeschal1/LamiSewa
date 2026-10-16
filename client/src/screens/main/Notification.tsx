import {
  View,
  StatusBar,
  Switch,
  ScrollView,
  TouchableOpacity,
  Text,
  RefreshControl,
  Image,
} from "react-native";
import { LottieLoadingAnimation } from "@/src/constants/LoadingAnimation";
import React, { FC, useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import {
  Description,
  MainScreenName,
  SubTitle,
} from "@/src/components/systemComponentsLayout";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProps } from "@/src/components/componentsType";
import { fetchNotifications, markAllNotificationsRead, markNotificationRead } from "@/src/services/notifications/notifications";
import { fetchMemberProfile } from "@/src/services/profile/updateProfile";
import { useInbox } from "@/src/notifications/InboxProvider";

const lamisewaLogo = require("@/src/assets/images/vectorLogo.png");
const FALLBACK_PIC = "https://i.pinimg.com/736x/ff/14/a0/ff14a0b3a565567f03f47147f50b64e8.jpg";

const Notification: FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const [enabled, setEnabled] = useState<boolean>(true);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { event, connected } = useInbox();

  const load = useCallback(async () => {
    try {
      const items = await fetchNotifications();
      items.sort((a: any, b: any) => Number(a.is_read) - Number(b.is_read));
      setItems(items);
    } catch {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!event) return;
    if (!["message", "follow", "announcement"].includes(event.ntype)) return;
    load();
  }, [event, load]);

  useEffect(() => {
    if (connected) return;
    const timer = setInterval(() => load(), 20000);
    return () => clearInterval(timer);
  }, [connected, load]);

  const openItem = async (n: any) => {
    try {
      await markNotificationRead(n.id);
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)));
    } catch {}
    const profileid = n?.data?.profileid;
    if (n?.kind === "follow" && profileid) {
      try {
        const full = await fetchMemberProfile(profileid);
        navigation.navigate("MemberProfile", { profile: full });
      } catch {}
    }
  };

  const markAll = async () => {
    try {
      await markAllNotificationsRead();
      setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {}
  };

  const bgFor = (n: any) => (n.is_read ? "#ECEBFF" : "#FDECEC");

  const kindIcon = (kind: string) => {
    if (kind === "follow") return "person-add";
    if (kind === "message") return "chatbox";
    return "notifications";
  };

  const isAdmin = (n: any) => n.kind === "announcement" && !(n?.data?.actor_pic || n?.data?.profileid);
  const actorPic = (n: any) => n?.data?.actor_pic || "";
  const actorName = (n: any) => n?.data?.actor_name || "";
  const titleFor = (n: any) => {
    if (isAdmin(n)) return "Lamisewa";
    if (n.kind === "follow" && actorName(n)) return `${actorName(n)} followed you.`;
    return n.title;
  };
  const bodyFor = (n: any) => {
    if (isAdmin(n)) return n.body ?? "";
    if (n.kind === "follow") return "Tap to view profile";
    return n.body ?? "";
  };

  return (
    <SafeAreaView className="flex flex-1 bg-background" edges={["bottom", "left", "right"]}>
      <View className="flex-1 w-full justify-start bg-background">
        <StatusBar hidden={false} translucent />
        <View className="p-screen pb-0">
          <View className="w-full items-center" style={{ paddingTop: 10 }}>
            <MainScreenName text="Notifications" />
          </View>
          <View className="gap-mid w-full flex-row items-center justify-between">
            <View className="flex flex-row gap-mid">
              <Ionicons name="notifications" size={24} color="black" />
              <SubTitle text="App Notification" />
            </View>
            <Switch
              value={enabled}
              onValueChange={setEnabled}
              trackColor={{ false: "#BBBDC8", true: "#FF000E" }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View className="w-full flex-row justify-end mt-small">
            <TouchableOpacity onPress={markAll}>
              <Text className="font-Poppinsmedium text-primaryblue text-description">Mark all as read</Text>
            </TouchableOpacity>
          </View>
        </View>
        {loading ? <LottieLoadingAnimation /> : null}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 1, paddingVertical: 8 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        >
          {items.filter((n) => enabled || !n.is_read).map((n) => (
            <TouchableOpacity
              key={n.id}
              onPress={() => openItem(n)}
              style={{ backgroundColor: bgFor(n) }}
              className="flex-row items-center gap-mid px-screen py-3 w-full"
            >
              {isAdmin(n) ? (
                <Image source={lamisewaLogo} style={{ width: 56, height: 56, borderRadius: 28 }} resizeMode="cover" />
              ) : actorPic(n) ? (
                <Image source={{ uri: actorPic(n) }} style={{ width: 56, height: 56, borderRadius: 28 }} />
              ) : (
                <View
                  className="items-center justify-center bg-white"
                  style={{ width: 56, height: 56, borderRadius: 28 }}
                >
                  <Ionicons
                    name={kindIcon(n.kind)}
                    size={26}
                    color={n.is_read ? "#7B7B7B" : "#FF000E"}
                  />
                </View>
              )}
              <View className="flex-1">
                <Text className="font-Poppinsmedium text-dark text-subheading" numberOfLines={1}>
                  {titleFor(n)}
                </Text>
                <Text className="font-Poppinsregular text-darkvariant text-description" numberOfLines={2}>
                  {bodyFor(n)}
                </Text>
              </View>
              {n.is_read ? null : (
                <View
                  style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#FF000E" }}
                />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
        {!loading && items.length === 0 ? (
          <View className="p-screen">
            <Description text="No notifications yet." />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default Notification;
