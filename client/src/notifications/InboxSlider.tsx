import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { FC, useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useInbox } from "./InboxProvider";
import { navigateFromSlider } from "@/src/constants/navigationRef";
import { fetchMemberProfile } from "@/src/services/profile/updateProfile";

const lamisewaLogo = require("@/src/assets/images/vectorLogo.png");
const FALLBACK_PIC = "https://i.pinimg.com/736x/ff/14/a0/ff14a0b3a565567f03f47147f50b64e8.jpg";

const InboxSlider: FC = () => {
  const { event } = useInbox();
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!event) return;
    if (!["message", "follow", "announcement"].includes(event.ntype)) return;
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
        navigateFromSlider("Conversation", { threadId: event.thread_id });
      } else if (event.ntype === "follow" && event.actor_profileid) {
        const full = await fetchMemberProfile(event.actor_profileid);
        navigateFromSlider("MemberProfile", { profile: full });
      } else {
        navigateFromSlider("MyTabs", { screen: "Notification" });
      }
    } catch {}
  };

  const pic = event.other_pic || event.actor_pic || "";
  const isAdmin = event.ntype === "announcement" && !pic;

  return (
    <View className="absolute top-2 left-4 right-4 z-50">
      <TouchableOpacity
        onPress={openEvent}
        className="flex-row items-center gap-mid rounded-2xl px-4 py-4"
        style={{ backgroundColor: "#E4E0F7", elevation: 8, minHeight: 92 }}
      >
        {isAdmin ? (
          <Image source={lamisewaLogo} style={{ width: 60, height: 60, borderRadius: 30 }} resizeMode="cover" />
        ) : pic ? (
          <Image source={{ uri: pic }} style={{ width: 60, height: 60, borderRadius: 30 }} />
        ) : (
          <View
            className="items-center justify-center bg-white"
            style={{ width: 60, height: 60, borderRadius: 30 }}
          >
            <Ionicons
              name={event.ntype === "message" ? "chatbox" : "notifications"}
              size={28}
              color="#7B7B7B"
            />
          </View>
        )}
        <View className="flex-1">
          <Text className="font-Poppinsmedium text-dark text-subheading" numberOfLines={1}>
            {event.ntype === "message" ? event.other_name || event.title : event.title}
          </Text>
          <Text className="font-Poppinsregular text-darkvariant text-description" numberOfLines={2}>
            {event.body}
          </Text>
        </View>
        <TouchableOpacity onPress={() => setVisible(false)} className="p-1">
          <Ionicons name="close" size={20} color="#7B7B7B" />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

export default InboxSlider;
