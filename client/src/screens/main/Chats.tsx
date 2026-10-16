import {
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  Text,
  ActivityIndicator,
  Modal,
  Dimensions,
} from "react-native";
import React, { FC, useCallback, useRef, useState } from "react";
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
import { fetchStories, uploadStory } from "@/src/services/profile/stories";
import { useProfile } from "@/src/profile/ProfileProvider";
import UploadImages from "@/src/utils/uploadImages";

const { width } = Dimensions.get("window");
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
  const [viewer, setViewer] = useState<string | null>(null);
  const [uploadingStory, setUploadingStory] = useState(false);
  const [tab, setTab] = useState<"general" | "requests">("general");
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<any | null>(null);
  const lastSeen = useRef<Record<number, string>>({});
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { data: profileData } = useProfile();
  const myPic = (profileData as any)?.basic_info?.profile_picture ?? "";
  const myProfileId = (profileData as any)?.profile?.profileid ?? "";

  const load = useCallback(async (silent = false) => {
    try {
      const list = await fetchConversations();
      setThreads(list);
      if (silent) {
        list.forEach((t: any) => {
          const key = `${t.last_at ?? ""}|${t.last_text ?? ""}`;
          const prev = lastSeen.current[t.id];
          if (prev !== undefined && prev !== key && t.last_by_me === false && t.last_text) {
            setBanner(t);
            if (bannerTimer.current) clearTimeout(bannerTimer.current);
            bannerTimer.current = setTimeout(() => setBanner(null), 4500);
          }
          lastSeen.current[t.id] = key;
        });
      } else {
        list.forEach((t: any) => {
          lastSeen.current[t.id] = `${t.last_at ?? ""}|${t.last_text ?? ""}`;
        });
      }
    } catch {}
    try {
      setMutual(await fetchMutual());
    } catch {}
    try {
      setStories(await fetchStories());
    } catch {}
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
      const timer = setInterval(() => load(true), 15000);
      return () => {
        clearInterval(timer);
        if (bannerTimer.current) clearTimeout(bannerTimer.current);
      };
    }, [load])
  );

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

  const openConversation = (thread: any) => {
    navigation.navigate("Conversation", { threadId: thread.id });
  };

  const general = threads.filter(isGeneral).sort((a: any, b: any) => String(b.last_at ?? "") > String(a.last_at ?? "") ? 1 : -1);
  const requests = threads.filter((t) => !isGeneral(t)).sort((a: any, b: any) => String(b.last_at ?? "") > String(a.last_at ?? "") ? 1 : -1);
  const shown = tab === "general" ? general : requests;

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
        {banner ? (
          <TouchableOpacity
            onPress={() => {
              setBanner(null);
              openConversation(banner);
            }}
            className="flex-row items-center gap-mid bg-[#ECEBFF] border border-primaryblue rounded-2xl px-4 py-3 mb-2"
          >
            <Image
              source={{ uri: banner.other_pic || "https://i.pinimg.com/736x/ff/14/a0/ff14a0b3a565567f03f47147f50b64e8.jpg" }}
              style={{ width: 44, height: 44, borderRadius: 22 }}
            />
            <View className="flex-1">
              <Text className="font-Poppinsmedium text-dark text-subheading" numberOfLines={1}>
                {banner.other_name} sent you a message
              </Text>
              <Text className="font-Poppinsregular text-dark text-description" numberOfLines={1}>
                {banner.last_text}
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}
        <View className="mt-large gap-mid">
          <Title text="People you've followed" />
          <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={{ paddingHorizontal: 4, gap: 12 }}>
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
              const label = firstName(u);
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
                  {t.unread > 0 ? (
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
