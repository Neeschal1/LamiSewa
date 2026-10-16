import {
  View,
  StatusBar,
  Switch,
  ScrollView,
  TouchableOpacity,
  Text,
  RefreshControl,
} from "react-native";
import { LottieLoadingAnimation } from "@/src/constants/LoadingAnimation";
import React, { FC, useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Description,
  MainScreenName,
  SubTitle,
} from "@/src/components/systemComponentsLayout";
import { Ionicons } from "@expo/vector-icons";
import { fetchNotifications, markAllNotificationsRead, markNotificationRead } from "@/src/services/notifications/notifications";

const Notification: FC = () => {
  const [enabled, setEnabled] = useState<boolean>(true);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  const openItem = async (id: number) => {
    try {
      await markNotificationRead(id);
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch {}
  };

  const markAll = async () => {
    try {
      await markAllNotificationsRead();
      setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {}
  };

  const bgFor = (n: any) => (n.is_read ? "#ECEBFF" : "#FDECEC");

  return (
    <SafeAreaView className="flex flex-1 bg-background" edges={["bottom", "left", "right"]}>
      <View className="flex-1 items-center w-full justify-start bg-background p-screen">
        <StatusBar hidden={false} translucent />
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
        {loading ? <LottieLoadingAnimation /> : null}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingVertical: 8 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        >
          {items.filter((n) => enabled || !n.is_read).map((n) => (
            <TouchableOpacity
              key={n.id}
              onPress={() => openItem(n.id)}
              style={{ backgroundColor: bgFor(n) }}
              className="flex flex-row gap-small items-center rounded-2xl px-4 py-3"
            >
              <Ionicons name={n.is_read ? "mail-open" : "mail-unread"} size={30} color={n.is_read ? "#BBBDC8" : "#FF000E"} />
              <View className="flex-1">
                <SubTitle text={n.title} />
                <Description text={n.body ?? ""} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {!loading && items.length === 0 ? <Description text="No notifications yet." /> : null}
      </View>
    </SafeAreaView>
  );
};

export default Notification;
