import {
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  Text,
  ActivityIndicator,
  TextInput,
  Modal,
  Dimensions,
} from "react-native";
import React, { FC, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import {
  Description,
  MainScreenName,
  SubHeading,
  SubTitle,
  Title,
} from "@/src/components/systemComponentsLayout";
import { Ionicons } from "@expo/vector-icons";
import { fetchConversations, fetchMessages, sendMessage } from "@/src/services/chat/chat";
import { fetchMutual } from "@/src/services/privacy/follow";
import { fetchStories, uploadStory } from "@/src/services/profile/stories";
import { getAccessTokens } from "@/src/storage/SecureTokens";
import { useProfile } from "@/src/profile/ProfileProvider";
import UploadImages from "@/src/utils/uploadImages";

const { width } = Dimensions.get("window");
const STORY_SIZE = width * 0.18;
const BORDER_SIZE = STORY_SIZE + 8;
const PLUS_SIZE = STORY_SIZE * 0.35;

const myProfile = require("@/src/assets/images/myPP.png");

const Chats: FC = () => {
  const [threads, setThreads] = useState<any[]>([]);
  const [mutual, setMutual] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [viewer, setViewer] = useState<string | null>(null);
  const [uploadingStory, setUploadingStory] = useState(false);
  const [activeThread, setActiveThread] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const ws = useRef<WebSocket | null>(null);
  const { data: profileData } = useProfile();
  const myPic = (profileData as any)?.basic_info?.profile_picture ?? "";
  const myProfileId = (profileData as any)?.profile?.profileid ?? "";

  useEffect(() => {
    const load = async () => {
      try {
        setThreads(await fetchConversations());
      } catch {}
      try {
        setMutual(await fetchMutual());
      } catch {}
      try {
        setStories(await fetchStories());
      } catch {}
      setLoading(false);
    };
    load();
    return () => ws.current?.close();
  }, []);

  const storyFor = (profileid: string) => stories.find((s: any) => s.profileid === profileid);

  const addStory = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8 });
    if (result.canceled) return;
    setUploadingStory(true);
    try {
      const url = await UploadImages(result.assets[0].uri);
      if (url) {
        const saved = await uploadStory(url);
        setStories((prev) => {
          const rest = prev.filter((s: any) => s.profileid !== saved.profileid);
          return [saved, ...rest];
        });
      }
    } catch {
    } finally {
      setUploadingStory(false);
    }
  };

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
          <Title text="People you've followed" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 4, gap: 12 }}>
            <TouchableOpacity
              className="items-center"
              onPress={() => {
                const mine = storyFor(myProfileId);
                if (mine?.has_story) setViewer(mine.story);
                else addStory();
              }}
              disabled={uploadingStory}
            >
              <View>
                {storyFor(myProfileId)?.has_story ? (
                  <View
                    className="border-2 border-primaryblue rounded-full items-center justify-center"
                    style={{ width: BORDER_SIZE, height: BORDER_SIZE }}
                  >
                    <Image
                      source={myPic ? { uri: myPic } : myProfile}
                      style={{ width: STORY_SIZE, height: STORY_SIZE, borderRadius: STORY_SIZE / 2 }}
                    />
                  </View>
                ) : (
                  <Image
                    source={myPic ? { uri: myPic } : myProfile}
                    style={{ width: BORDER_SIZE, height: BORDER_SIZE, borderRadius: BORDER_SIZE / 2 }}
                  />
                )}
                <View
                  className="bg-primaryred rounded-full absolute items-center justify-center"
                  style={{ width: PLUS_SIZE, height: PLUS_SIZE, right: 0, bottom: 0 }}
                >
                  {uploadingStory ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <SubHeading text="+" />
                  )}
                </View>
              </View>
              <SubTitle text="You" />
            </TouchableOpacity>
            {mutual.map((u: any) => {
              const story = storyFor(u.profileid);
              return (
                <TouchableOpacity
                  key={u.profileid}
                  className="items-center"
                  disabled={!story?.has_story}
                  onPress={() => story?.has_story && setViewer(story.story)}
                >
                  {story?.has_story ? (
                    <View
                      className="border-2 border-primaryblue rounded-full items-center justify-center"
                      style={{ width: BORDER_SIZE, height: BORDER_SIZE }}
                    >
                      <Image
                        source={{ uri: story.pic || u.pic }}
                        style={{ width: STORY_SIZE, height: STORY_SIZE, borderRadius: STORY_SIZE / 2 }}
                      />
                    </View>
                  ) : (
                    <Image
                      source={{ uri: u.pic }}
                      style={{ width: BORDER_SIZE, height: BORDER_SIZE, borderRadius: BORDER_SIZE / 2 }}
                    />
                  )}
                  <SubTitle text={u.name ?? u.username} />
                </TouchableOpacity>
              );
            })}
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
      <Modal visible={viewer !== null} transparent animationType="fade" onRequestClose={() => setViewer(null)}>
        <View className="flex-1 bg-black items-center justify-center">
          {viewer ? (
            <Image source={{ uri: viewer }} style={{ width: width * 0.92, height: width * 1.3, borderRadius: 16 }} resizeMode="contain" />
          ) : null}
          <TouchableOpacity
            onPress={() => setViewer(null)}
            className="absolute top-14 right-6 w-11 h-11 rounded-full bg-black/60 items-center justify-center"
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Chats;
