import { View, Text, ScrollView, StatusBar, Image, ImageBackground, TouchableOpacity, Dimensions } from "react-native";
import { LottieLoadingAnimation } from "@/src/constants/LoadingAnimation";
import React, { FC, useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Describe, Title } from "@/src/components/systemComponentsLayout";
import { NavigationProps } from "@/src/components/componentsType";
import { followUser, unfollowUser, fetchFollowing, fetchMutual } from "@/src/services/privacy/follow";
import { createThreadByProfile } from "@/src/services/chat/chat";
import { useProfile } from "@/src/profile/ProfileProvider";

const { width, height } = Dimensions.get("window");

const same = (a: any, b: any) => {
  if (!a || !b) return false;
  return String(a).trim().toLowerCase() === String(b).trim().toLowerCase();
};

const displayValue = (v: any) => {
  if (v === null || v === undefined || String(v).trim() === "") return "-";
  if (String(v).trim() === "That's Me") return "Myself";
  return String(v);
};

const MatchRow = ({ label, mine, theirs }: { label: string; mine: any; theirs: any }) => (
  <View className="flex-row justify-between w-full py-2 border-b border-darkvariant/10">
    <Text className="font-Poppinsregular text-dark text-description">{label}</Text>
    <View className="flex-row items-center gap-small flex-1 ml-4 justify-end">
      <Text className="font-Poppinsmedium text-dark text-description text-right">
        {displayValue(theirs)}
      </Text>
      {same(mine, theirs) ? <Ionicons name="heart" size={16} color="#22C55E" /> : null}
    </View>
  </View>
);

const MemberProfile: FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<any>();
  const p = route?.params?.profile ?? {};
  const { data: myData } = useProfile();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isMutual, setIsMutual] = useState(false);
  const [checking, setChecking] = useState(true);

  const basic = p?.basic_info ?? {};
  const personal = p?.personal_info ?? {};
  const additional = p?.additional_info ?? {};
  const career = p?.career_info ?? {};
  const myPersonal = (myData as any)?.personal_info ?? {};
  const myAdditional = (myData as any)?.additional_info ?? {};
  const myCareer = (myData as any)?.career_info ?? {};
  const myHobbies: string[] = (myData as any)?.hobbies ? Object.values((myData as any).hobbies).map((h: any) => String(h)) : [];
  const hobbies: string[] = Array.isArray(p?.hobbies) ? p.hobbies.map((h: any) => String(typeof h === "string" ? h : h?.hobby ?? h)) : [];
  const featured: string[] = Array.isArray((p as any)?.featured_photos) && (p as any).featured_photos.length > 0
    ? (p as any).featured_photos
    : Array.isArray((p as any)?.featured_urls)
    ? (p as any).featured_urls
    : Array.isArray(p?.featured_images) ? p.featured_images : [];

  const pic = basic?.profile_picture || "https://i.pinimg.com/736x/ff/14/a0/ff14a0b3a565567f03f47147f50b64e8.jpg";
  const cover = basic?.cover_picture || pic;
  const name = basic?.fullname || basic?.nickname || p?.username || "Member";

  const checkRelation = useCallback(async () => {
    try {
      const following = await fetchFollowing();
      setIsFollowing(following.some((u: any) => u.profileid === p?.profileid));
    } catch {}
    try {
      const mutual = await fetchMutual();
      setIsMutual(mutual.some((u: any) => u.profileid === p?.profileid));
    } catch {}
    setChecking(false);
  }, [p?.profileid]);

  useEffect(() => {
    checkRelation();
  }, [checkRelation]);

  const toggleFollow = async () => {
    if (!p?.profileid) return;
    try {
      if (isFollowing) {
        await unfollowUser(p.profileid);
        setIsFollowing(false);
        setIsMutual(false);
      } else {
        await followUser(p.profileid);
        setIsFollowing(true);
        checkRelation();
      }
    } catch {}
  };

  const startChat = async () => {
    if (!p?.profileid) return;
    try {
      const thread = await createThreadByProfile(p.profileid);
      if (thread?.id) navigation.navigate("Conversation", { threadId: thread.id });
    } catch {}
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground source={{ uri: cover }} style={{ width, height: height * 0.22 }} resizeMode="cover">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mt-12 ml-4 w-11 h-11 rounded-full bg-black/50 items-center justify-center">
            <Ionicons name="arrow-back" size={22} color="white" />
          </TouchableOpacity>
        </ImageBackground>
        <View className="px-screen pt-4">
          <View className="flex-row items-center gap-mid">
            <Image source={{ uri: pic }} style={{ width: 110, height: 110, borderRadius: 60, borderWidth: 3, borderColor: "#0066FF" }} />
            <View className="flex-1">
              <Text className="font-Poppinssemibold text-dark text-[22px]">{name}</Text>
              {basic?.nickname ? (
                <Text className="font-Poppinsregular text-dark text-description">@{basic.nickname}</Text>
              ) : null}
              {typeof p?.score === "number" ? (
                <Text className="font-Poppinsmedium text-primaryblue">{Math.round(p.score * 100)}% match</Text>
              ) : null}
            </View>
          </View>
          {basic?.bio ? (
            <View className="mt-3">
              <Text className="font-Poppinsregular text-dark text-description">{basic.bio}</Text>
            </View>
          ) : null}
          {!checking && !isMutual ? (
            <Text className="font-Poppinsregular text-darkvariant text-description mt-2">
              Send one message request — two-way chat unlocks when you follow each other.
            </Text>
          ) : null}
          {checking ? (
            <LottieLoadingAnimation />
          ) : (
            <View className="flex-row gap-mid mt-4">
              <TouchableOpacity onPress={toggleFollow} className={`px-6 py-2 rounded-2xl ${isFollowing ? "border border-primaryblue" : "bg-primaryred"}`}>
                <Text className={`font-Poppinsmedium ${isFollowing ? "text-primaryblue" : "text-background"}`}>
                  {isFollowing ? "Following" : "Follow"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={startChat} className="border border-primaryblue px-6 py-2 rounded-2xl">
                <Text className="font-Poppinsmedium text-primaryblue">Message</Text>
              </TouchableOpacity>
            </View>
          )}
          {featured.length > 0 ? (
            <View className="mt-4">
              <Title text="Photos" />
              <View className="flex-row flex-wrap justify-between mt-2">
                {featured.slice(0, 6).map((uri) => (
                  <Image
                    key={uri}
                    source={{ uri }}
                    style={{ width: "31%", aspectRatio: 3 / 4, borderRadius: 12, marginBottom: 8 }}
                    resizeMode="cover"
                  />
                ))}
              </View>
            </View>
          ) : null}
          <View className="mt-4">
            <Title text="Basic Info" />
            <MatchRow label="Full name" mine={null} theirs={basic?.fullname} />
            <MatchRow label="Gender" mine={null} theirs={basic?.gender} />
            <MatchRow label="Date of birth" mine={null} theirs={basic?.date_of_birth} />
            <MatchRow label="Profile for" mine={null} theirs={basic?.profile_handler} />
          </View>
          <View className="mt-4">
            <Title text="Location & Personal" />
            <MatchRow label="Country" mine={myPersonal?.current_living_country} theirs={personal?.current_living_country} />
            <MatchRow label="City" mine={myPersonal?.current_city} theirs={personal?.current_city} />
            <MatchRow label="Residency" mine={myPersonal?.residency_status} theirs={personal?.residency_status} />
            <MatchRow label="Marital status" mine={myPersonal?.maritalstatus} theirs={personal?.maritalstatus} />
            <MatchRow label="Gotra" mine={myPersonal?.gotra} theirs={personal?.gotra} />
          </View>
          <View className="mt-4">
            <Title text="Additional" />
            <MatchRow label="Height" mine={myAdditional?.height} theirs={additional?.height} />
            <MatchRow label="Weight" mine={myAdditional?.weight} theirs={additional?.weight} />
            <MatchRow label="Religion" mine={myAdditional?.religion} theirs={additional?.religion} />
            <MatchRow label="Diet" mine={myAdditional?.diet} theirs={additional?.diet} />
            <MatchRow label="Community" mine={myAdditional?.community} theirs={additional?.community} />
          </View>
          {hobbies.length > 0 ? (
            <View className="mt-4">
              <Title text="Hobbies" />
              <View className="flex-row flex-wrap gap-2 mt-2">
                {hobbies.map((h) => (
                  <View key={h} className="flex-row items-center bg-black px-4 py-2 rounded-2xl gap-small">
                    <Describe text={h} />
                    {myHobbies.some((m) => same(m, h)) ? <Ionicons name="heart" size={14} color="#22C55E" /> : null}
                  </View>
                ))}
              </View>
            </View>
          ) : null}
          <View className="mt-4 mb-8">
            <Title text="Career" />
            <MatchRow label="Qualification" mine={myCareer?.highest_qualification} theirs={career?.highest_qualification} />
            <MatchRow label="College" mine={myCareer?.college_name} theirs={career?.college_name} />
            <MatchRow label="Working as" mine={myCareer?.working_as} theirs={career?.working_as} />
            <MatchRow label="Occupation" mine={myCareer?.occupation} theirs={career?.occupation} />
            <MatchRow label="Organization" mine={myCareer?.company_or_organization_name} theirs={career?.company_or_organization_name} />
            {p?.username ? <MatchRow label="Username" mine={null} theirs={p.username} /> : null}
            {p?.profileid ? <MatchRow label="Profile ID" mine={null} theirs={p.profileid} /> : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MemberProfile;
