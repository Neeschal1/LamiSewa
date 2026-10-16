import {
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  Text,
  Modal,
  Dimensions,
} from "react-native";
import { LottieLoadingAnimation } from "@/src/constants/LoadingAnimation";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import {
  Description,
  MainScreenName,
  SubHeading,
  SubTitle,
  Title,
} from "@/src/components/systemComponentsLayout";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProps } from "@/src/components/componentsType";
import { fetchConversations } from "@/src/services/chat/chat";
import { fetchMutual } from "@/src/services/privacy/follow";
import { fetchStories, fetchStoryViewers, recordStoryView, uploadStory } from "@/src/services/profile/stories";
import { useProfile } from "@/src/profile/ProfileProvider";
import { useInbox } from "@/src/notifications/InboxProvider";
import UploadImages from "@/src/utils/uploadImages";

const { width, height } = Dimensions.get("window");
const STORY_SIZE = width * 0.18;
const BORDER_SIZE = STORY_SIZE + 8;
const PLUS_SIZE = STORY_SIZE * 0.35;

const myProfile = require("@/src/assets/images/myPP.png");

const isGeneral = (t: any) => t.mutual === true || (t.i_sent === true && t.they_sent === true);

const firstName = (u: any) => String(u.name ?? u.username ?? "User").split(" ")[0];

const Chats: FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const [threads, setThreads] = useState<any[]>([]);
  const [mutual, setMutual] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [viewer, setViewer] = useState<any | null>(null);
  const [storyViewers, setStoryViewers] = useState<any[]>([]);
  const [storyViewersVisible, setStoryViewersVisible] = useState<boolean>(false);
  const [uploadingStory, setUploadingStory] = useState(false);
  const [tab, setTab] = useState<"general" | "requests">("general");
  const [loading, setLoading] = useState(true);
  const [typingThreads, setTypingThreads] = useState<Record<number, string>>({});
  const typingTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
  const { event } = useInbox();

  const load = useCallback(async () => {
    try {
      const [list, people, storyList] = await Promise.all([
        fetchConversations(),
        fetchMutual(),
        fetchStories(),
      ]);
      setThreads(list);
      setMutual(people);
      setStories(storyList);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      const refreshThreads = async () => {
        try {
          setThreads(await fetchConversations());
        } catch {}
      };
      refreshThreads();
    }, [])
  );

  useEffect(() => {
    if (!event || event.ntype !== "message" || !event.thread_id) return;
    setThreads((prev) => {
      const i = prev.findIndex((t: any) => t.id === event.thread_id);
      const now = new Date().toISOString();
      if (i >= 0) {
        const next = [...prev];
        const current = next[i];
        next.splice(i, 1);
        next.unshift({
          ...current,
          last_text: event.body ?? current.last_text,
          last_at: now,
          last_by_me: false,
          unread: (current.unread ?? 0) + 1,
          they_sent: true,
        });
        return next;
      }
      return [
        {
          id: event.thread_id,
          other_profileid: event.other_profileid ?? "",
          other_pic: event.other_pic ?? "",
          other_name: event.other_name ?? event.title,
          last_text: event.body ?? "",
          last_at: now,
          last_by_me: false,
          unread: 1,
          mutual: false,
          i_sent: false,
          they_sent: true,
          can_message: true,
        },
        ...prev,
      ];
    });
  }, [event]);

  useEffect(() => {
    if (!event || (event as any).ntype !== "typing" || !event.thread_id) return;
    const tid = event.thread_id;
    if (event.typing) {
      setTypingThreads((p) => ({ ...p, [tid]: event.name || event.title }));
      if (typingTimers.current[tid]) clearTimeout(typingTimers.current[tid]);
      typingTimers.current[tid] = setTimeout(() => {
        setTypingThreads((p) => {
          const next = { ...p };
          delete next[tid];
          return next;
        });
      }, 4000);
    } else {
      if (typingTimers.current[tid]) clearTimeout(typingTimers.current[tid]);
      setTypingThreads((p) => {
        const next = { ...p };
        delete next[tid];
        return next;
      });
    }
  }, [event]);

  const { data: profileData } = useProfile();
  const myPic = (profileData as any)?.basic_info?.profile_picture ?? "";
  const myProfileId = (profileData as any)?.profile?.profileid ?? "";

  const storyFor = (profileid: string) => stories.find((s: any) => s.profileid === profileid);

  const openStory = async (story: any) => {
    if (!story?.has_story) return;
    setViewer(story);
    if (story.profileid !== myProfileId && story.id) {
      try {
        await recordStoryView(story.id);
      } catch {}
    }
  };

  const openOwnViewers = async () => {
    if (!viewer?.id) return;
    try {
      setStoryViewers(await fetchStoryViewers(viewer.id));
    } catch {
      setStoryViewers([]);
    }
    setStoryViewersVisible(true);
  };

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

  const openConversation = (thread: any) => {
    navigation.navigate("Conversation", { threadId: thread.id });
  };

  const general = threads.filter(isGeneral).sort((a: any, b: any) => String(b.last_at ?? "") > String(a.last_at ?? "") ? 1 : -1);
  const requests = threads.filter((t) => !isGeneral(t)).sort((a: any, b: any) => String(b.last_at ?? "") > String(a.last_at ?? "") ? 1 : -1);
  const shown = tab === "general" ? general : requests;

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <LottieLoadingAnimation />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom", "left", "right"]}>
      <StatusBar hidden={false} translucent />
      {uploadingStory ? <LottieLoadingAnimation /> : null}
      <View className="flex-1 w-full bg-background p-screen">
        <View className="w-full items-center" style={{ paddingTop: 10 }}>
          <MainScreenName text="Messages" />
        </View>
        <View className="mt-large gap-mid">
          <Title text="People you've followed" />
          <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={{ paddingHorizontal: 4, gap: 12 }}>
            <TouchableOpacity
              className="items-center"
              onPress={() => {
                const mine = storyFor(myProfileId);
                if (mine?.has_story) openStory(mine);
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
                    <SubHeading text="..." />
                  ) : (
                    <SubHeading text="+" />
                  )}
                </View>
              </View>
              <SubTitle text="You" />
            </TouchableOpacity>
            {mutual.map((u: any) => {
              const story = storyFor(u.profileid);
              const label = firstName(u);
              return (
                <TouchableOpacity
                  key={u.profileid}
                  className="items-center"
                  disabled={!story?.has_story}
                  onPress={() => story?.has_story && openStory(story)}
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
                  <SubTitle text={label} />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        <View className="flex-row gap-mid mt-large">
          <TouchableOpacity
            onPress={() => setTab("general")}
            className={`px-5 py-2 rounded-full ${tab === "general" ? "bg-primaryred" : "bg-[#ECEBFF]"}`}
          >
            <Text className={`font-Poppinsmedium ${tab === "general" ? "text-background" : "text-dark"}`}>
              General{general.length > 0 ? ` (${general.length})` : ""}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab("requests")}
            className={`px-5 py-2 rounded-full ${tab === "requests" ? "bg-primaryred" : "bg-[#ECEBFF]"}`}
          >
            <Text className={`font-Poppinsmedium ${tab === "requests" ? "text-background" : "text-dark"}`}>
              Requests{requests.length > 0 ? ` (${requests.length})` : ""}
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView className="mt-mid">
          {shown.length === 0 ? (
            <Description text={tab === "general" ? "No conversations yet" : "No message requests"} />
          ) : (
            shown.map((t: any) => (
              <TouchableOpacity
                key={t.id}
                onPress={() => openConversation(t)}
                className="flex-row items-center gap-mid py-3 border-b border-darkvariant/10"
              >
                <Image
                  source={{ uri: t.other_pic || "https://i.pinimg.com/736x/ff/14/a0/ff14a0b3a565567f03f47147f50b64e8.jpg" }}
                  style={{ width: 52, height: 52, borderRadius: 26 }}
                />
                <View className="flex-1">
                  <Text className="font-Poppinsmedium text-dark">{t.other_name}</Text>
                  {typingThreads[t.id] ? (
                    <Text className="font-Poppinsregular text-primaryblue text-description" numberOfLines={1}>
                      typing...
                    </Text>
                  ) : t.last_by_me ? (
                    <Description text={`You: ${t.last_text || ""}`} />
                  ) : t.unread > 0 ? (
                    <Text className="font-Poppinsmedium text-primaryred text-description" numberOfLines={1}>
                      {t.last_text || "New message"}
                    </Text>
                  ) : (
                    <Description text={t.last_text || "No messages yet"} />
                  )}
                </View>
                {tab === "requests" ? <Ionicons name="mail-unread-outline" size={20} color="#FF000E" /> : null}
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
      <Modal visible={viewer !== null} transparent animationType="fade" onRequestClose={() => setViewer(null)}>
        <View className="flex-1 bg-black items-center justify-center">
          {viewer?.story ? (
            <Image source={{ uri: viewer.story }} style={{ width: width * 0.92, height: width * 1.3, borderRadius: 16 }} resizeMode="contain" />
          ) : null}
          {viewer?.profileid === myProfileId && viewer?.has_story ? (
            <TouchableOpacity
              onPress={openOwnViewers}
              className="absolute bottom-12 flex-row items-center gap-2 bg-black/60 px-5 py-2 rounded-full"
            >
              <Ionicons name="eye-outline" size={18} color="white" />
              <Text className="font-Poppinsregular text-white text-description">
                Viewed{viewer?.storyviews ? ` by ${viewer.storyviews}` : ""}
              </Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            onPress={() => setViewer(null)}
            className="absolute top-14 right-6 w-11 h-11 rounded-full bg-black/60 items-center justify-center"
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        visible={storyViewersVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setStoryViewersVisible(false)}
      >
        <View className="flex-1 bg-black/70 items-center justify-center p-screen">
          <View className="bg-background rounded-3xl p-screen w-full gap-mid" style={{ maxHeight: height * 0.6 }}>
            <Text className="font-Poppinssemibold text-dark text-heading text-center">
              Viewed by {storyViewers.length}
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {storyViewers.length === 0 ? <Description text="No views yet." /> : null}
              {storyViewers.map((v: any) => (
                <View key={v.profileid} className="flex-row items-center gap-mid py-2 border-b border-darkvariant/10">
                  <Image
                    source={{ uri: v.pic || "https://i.pinimg.com/736x/ff/14/a0/ff14a0b3a565567f03f47147f50b64e8.jpg" }}
                    style={{ width: 44, height: 44, borderRadius: 22 }}
                  />
                  <View className="flex-1">
                    <Text className="font-Poppinsmedium text-dark text-subheading">{v.name ?? v.username}</Text>
                    <Description text={`@${v.username}`} />
                  </View>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setStoryViewersVisible(false)}
              className="bg-primaryred rounded-2xl py-3 items-center"
            >
              <Text className="font-Poppinsmedium text-background">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Chats;
