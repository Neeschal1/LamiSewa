import {
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  Text,
  ActivityIndicator,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProps } from "@/src/components/componentsType";
import { fetchConversations, fetchMessages, sendMessage } from "@/src/services/chat/chat";
import { fetchMemberProfile } from "@/src/services/profile/updateProfile";
import { getAccessTokens } from "@/src/storage/SecureTokens";
import { useProfile } from "@/src/profile/ProfileProvider";
import { jwtDecode } from "jwt-decode";

const fmtTime = (iso: string) => {
  try {
    const d = new Date(iso);
    const h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${m} ${ampm}`;
  } catch {
    return "";
  }
};

const fmtDateTime = (iso: string) => {
  try {
    const d = new Date(iso);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${d.getDate()} ${months[d.getMonth()]}, ${fmtTime(iso)}`;
  } catch {
    return "";
  }
};

const dayLabel = (iso: string) => {
  try {
    const d = new Date(iso);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString();
  } catch {
    return "";
  }
};

const sameDay = (a: string, b: string) => {
  try {
    return new Date(a).toDateString() === new Date(b).toDateString();
  } catch {
    return false;
  }
};

const Conversation: FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<any>();
  const threadId = route.params?.threadId;
  const [thread, setThread] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [draft, setDraft] = useState("");
  const [sendError, setSendError] = useState("");
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState<number | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const { data: profileData } = useProfile();
  const profileUserId = Number((profileData as any)?.profile?.userid ?? NaN);

  const load = useCallback(async () => {
    if (Number.isFinite(profileUserId)) {
      setMyId(profileUserId);
    } else {
      try {
        const token = await getAccessTokens();
        if (token) {
          const payload = jwtDecode<{ user_id?: number }>(token);
          if (payload.user_id) setMyId(Number(payload.user_id));
        }
      } catch {}
    }
    try {
      const list = await fetchConversations();
      const found = list.find((t: any) => t.id === threadId) ?? null;
      setThread(found);
    } catch {}
    try {
      const msgs = await fetchMessages(threadId);
      setMessages(msgs);
    } catch {
      setMessages([]);
    }
    setLoading(false);
  }, [threadId, profileUserId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  useEffect(() => {
    const connect = async () => {
      try {
        const token = await getAccessTokens();
        const base = (process.env.EXPO_PUBLIC_DJANGO_DEVELOPMENT_SERVER_URL ?? "").replace(/^http/, "ws");
        const query = token ? `?token=${encodeURIComponent(token)}` : "";
        ws.current = new WebSocket(`${base}/ws/chat/${threadId}/${query}`);
        ws.current.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data);
            if (data?.id) {
              setMessages((m) => (m.some((x: any) => x.id === data.id) ? m : [...m, data]));
            }
          } catch {}
        };
      } catch {}
    };
    connect();
    return () => ws.current?.close();
  }, [threadId]);

  const handleSend = async () => {
    if (!thread || !draft.trim()) return;
    if (thread.can_message === false) {
      setSendError("You can send only one message until you both follow each other.");
      return;
    }
    const text = draft.trim();
    setDraft("");
    setSendError("");
    try {
      const saved = await sendMessage(thread.id, text);
      if (saved?.id) {
        setMessages((m) => (m.some((x: any) => x.id === saved.id) ? m : [...m, saved]));
      }
      const list = await fetchConversations();
      const found = list.find((t: any) => t.id === thread.id);
      if (found) setThread(found);
    } catch (e: any) {
      setSendError(e?.response?.data?.message ?? "Message not sent.");
    }
  };

  const openProfile = async () => {
    if (!thread?.other_profileid) return;
    try {
      const full = await fetchMemberProfile(thread.other_profileid);
      navigation.navigate("MemberProfile", { profile: full });
    } catch {}
  };

  const data = [...messages].reverse();

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const next = data[index + 1];
    const showDay = !next || !sameDay(item.created_date, next.created_date);
    const isMine = myId !== null && Number(item.message_user) === myId;
    return (
      <View>
        {showDay ? (
          <View className="items-center my-2">
            <Text className="font-Poppinsregular text-darkvariant text-description bg-darkvariant/10 px-3 py-1 rounded-full">
              {dayLabel(item.created_date)}
            </Text>
          </View>
        ) : null}
        {isMine ? (
          <View className="flex-row justify-end mb-2">
            <View className="bg-primaryred rounded-2xl rounded-br-sm px-3 py-2" style={{ maxWidth: "78%" }}>
              <Text className="font-Poppinsregular text-white text-subheading">{item.text}</Text>
              <View className="flex-row justify-end items-center gap-1 mt-1">
                <Text className="font-Poppinsregular text-white/80" style={{ fontSize: 10 }}>
                  {fmtDateTime(item.created_date)}
                </Text>
                <Text className="font-Poppinsregular text-white/80" style={{ fontSize: 10 }}>
                  {item.seen ? "✓✓ Seen" : "✓ Delivered"}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View className="flex-row items-end mb-2 gap-2">
            <TouchableOpacity onPress={openProfile}>
              <Image
                source={{ uri: thread?.other_pic || "https://i.pinimg.com/736x/ff/14/a0/ff14a0b3a565567f03f47147f50b64e8.jpg" }}
                style={{ width: 30, height: 30, borderRadius: 15 }}
              />
            </TouchableOpacity>
            <View className="bg-[#ECEBFF] rounded-2xl rounded-bl-sm px-3 py-2" style={{ maxWidth: "70%" }}>
              <Text className="font-Poppinsregular text-dark text-subheading">{item.text}</Text>
              <Text className="font-Poppinsregular text-darkvariant mt-1" style={{ fontSize: 10 }}>
                {fmtDateTime(item.created_date)}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <StatusBar hidden={false} />
      <View className="flex-row items-center gap-mid px-screen py-3 border-b border-darkvariant/10">
        <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 items-center justify-center">
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={openProfile} className="flex-row items-center gap-mid flex-1">
          <Image
            source={{ uri: thread?.other_pic || "https://i.pinimg.com/736x/ff/14/a0/ff14a0b3a565567f03f47147f50b64e8.jpg" }}
            style={{ width: 44, height: 44, borderRadius: 22 }}
          />
          <Text className="font-Poppinsmedium text-dark text-heading flex-1" numberOfLines={1}>
            {thread?.other_name ?? "Chat"}
          </Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1" keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}>
        <FlatList
          data={data}
          inverted
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
          showsVerticalScrollIndicator={false}
        />
        {thread?.can_message === false ? (
          <Text className="font-Poppinsregular text-darkvariant text-description px-screen pb-1">
            Message request sent — two-way chat unlocks when you follow each other.
          </Text>
        ) : null}
        {sendError ? (
          <Text className="font-Poppinsregular text-primaryred text-description px-screen pb-1">{sendError}</Text>
        ) : null}
        <View className="flex-row gap-mid items-center px-screen py-3 border-t border-darkvariant/10">
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Message"
            editable={thread?.can_message !== false}
            className="flex-1 border border-darkvariant/30 rounded-2xl px-4 py-3 font-Poppinsregular"
          />
          <TouchableOpacity onPress={handleSend} className="bg-primaryred rounded-full p-3">
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Conversation;
