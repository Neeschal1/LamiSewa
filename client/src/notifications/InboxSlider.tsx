import { View, Text, TouchableOpacity } from "react-native";
import React, { FC, useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProps } from "@/src/components/componentsType";
import { useInbox } from "./InboxProvider";
import { fetchMemberProfile } from "@/src/services/profile/updateProfile";

const InboxSlider: FC = () => {
  const { event } = useInbox();
  const navigation = useNavigation<NavigationProps>();
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!event) return;
    setVisible(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setVisible(false), 4500);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [event]);

  if (!visible || !event) return null;

  const openEvent = async () => {
    setVisible(false);
    try {
      if (event.ntype === "message" && event.thread_id) {
        navigation.navigate("Conversation", { threadId: event.thread_id });
      } else if (event.ntype === "follow" && event.actor_profileid) {
        const full = await fetchMemberProfile(event.actor_profileid);
        navigation.navigate("MemberProfile", { profile: full });
      } else {
        (navigation as any).navigate("MyTabs", { screen: "Notification" });
      }
    } catch {}
  };

  return (
    <View className="absolute top-2 left-4 right-4 z-50">
      <TouchableOpacity
        onPress={openEvent}
        className="flex-row items-center gap-mid bg-dark rounded-2xl px-4 py-3"
        style={{ elevation: 8 }}
      >
        <Ionicons
          name={event.ntype === "message" ? "chatbox" : "notifications"}
          size={26}
          color="white"
        />
        <View className="flex-1">
          <Text className="font-Poppinsmedium text-background text-subheading" numberOfLines={1}>
            {event.title}
          </Text>
          <Text className="font-Poppinsregular text-background/80 text-description" numberOfLines={2}>
            {event.body}
          </Text>
        </View>
        <TouchableOpacity onPress={() => setVisible(false)} className="p-1">
          <Ionicons name="close" size={20} color="white" />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

export default InboxSlider;
