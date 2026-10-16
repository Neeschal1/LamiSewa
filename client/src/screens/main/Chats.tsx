import {
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  Text,
  ActivityIndicator,
  TextInput,
} from "react-native";
import React, { FC, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Description,
  MainScreenName,
  SubTitle,
  Title,
} from "@/src/components/systemComponentsLayout";
import { Ionicons } from "@expo/vector-icons";
import { fetchConversations, fetchMessages, sendMessage } from "@/src/services/chat/chat";
import { fetchMutual } from "@/src/services/privacy/follow";
import { getAccessTokens } from "@/src/storage/SecureTokens";

const Chats: FC = () => {
  const [threads, setThreads] = useState<any[]>([]);
  const [mutual, setMutual] = useState<any[]>([]);
  const [activeThread, setActiveThread] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setThreads(await fetchConversations());
      } catch {}
      try {
        setMutual(await fetchMutual());
      } catch {}
      setLoading(false);
    };
    load();
    return () => ws.current?.close();
  }, []);

  const openThread = async (thread: any) => {
    setActiveThread(thread);
    try {
      setMessages(await fetchMessages(thread.id));
    } catch {
      setMessages([]);
    }
    try {
      ws.current?.close();
      const token = await getAccessTokens();
      const base = (process.env.EXPO_PUBLIC_DJANGO_DEVELOPMENT_SERVER_URL ?? "").replace(/^http/, "ws");
      ws.current = new WebSocket(`${base}/ws/chat/${thread.id}/`);
      void token;
      ws.current.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data?.id) setMessages((m) => [...m, data]);
        } catch {}
      };
    } catch {}
  };

  const handleSend = async () => {
    if (!activeThread || !draft.trim()) return;
    const text = draft.trim();
    setDraft("");
    try {
      const saved = await sendMessage(activeThread.id, text);
      if (saved?.id) setMessages((m) => [...m, saved]);
    } catch {}
    try {
      ws.current?.send(JSON.stringify({ text }));
    } catch {}
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar hidden={false} />
      <View className="flex-1 w-full bg-background p-screen">
        <MainScreenName text="Messages" />
        <View className="mt-large gap-mid">
          <Title text="Mutual follows" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {mutual.map((u: any) => (
              <View key={u.profileid} className="items-center mr-3">
                <Image source={{ uri: u.pic }} style={{ width: 64, height: 64, borderRadius: 32 }} />
                <SubTitle text={u.name ?? u.username} />
              </View>
            ))}
          </ScrollView>
        </View>
        {!activeThread ? (
          <ScrollView className="mt-large">
            {threads.length === 0 ? (
              <Description text="No messages" />
            ) : (
              threads.map((t: any) => (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => openThread(t)}
                  className="flex-row items-center gap-mid py-3 border-b border-darkvariant/10"
                >
                  <Ionicons name="person-circle" size={44} color="#888" />
                  <View className="flex-1">
                    <Text className="font-Poppinsmedium text-dark">{t.other_name}</Text>
                    <Description text={t.last_text ?? ""} />
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        ) : (
          <View className="flex-1 mt-large">
            <TouchableOpacity onPress={() => { setActiveThread(null); ws.current?.close(); }} className="mb-2">
              <Text className="font-Poppinsmedium text-primaryblue">Back</Text>
            </TouchableOpacity>
            <ScrollView className="flex-1">
              {messages.map((m: any) => (
                <View key={m.id} className="py-1">
                  <Text className="font-Poppinsregular text-dark">{m.text}</Text>
                </View>
              ))}
            </ScrollView>
            <View className="flex-row gap-mid items-center mt-2">
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder="Message"
                className="flex-1 border border-darkvariant/30 rounded-2xl px-4 py-3 font-Poppinsregular"
              />
              <TouchableOpacity onPress={handleSend} className="bg-primaryred rounded-full p-3">
                <Ionicons name="send" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Chats;
