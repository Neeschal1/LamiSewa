import { View, Text, ScrollView, StatusBar, Image, ImageBackground, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { Describe, Heading, SubHeading, SubTitle, Title } from '@/src/components/systemComponentsLayout'
import { followUser, unfollowUser } from '@/src/services/privacy/follow'
import { createThread } from '@/src/services/chat/chat'

const { width, height } = Dimensions.get("window");

const Row = ({ label, value }: { label: string; value: any }) => (
  <View className="flex-row justify-between w-full py-2 border-b border-darkvariant/10">
    <Text className="font-Poppinsregular text-descriptiveText text-description">{label}</Text>
    <Text className="font-Poppinsmedium text-dark text-description text-right flex-1 ml-4">
      {value ? String(value) : "-"}
    </Text>
  </View>
);

const UserDetails = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const p = route?.params?.profile ?? {};

  const basic = p?.basic_info ?? p?.basicInfo ?? {};
  const personal = p?.personal_info ?? p?.personalInfo ?? {};
  const additional = p?.additional_info ?? p?.additionalInfo ?? {};
  const career = p?.career_info ?? p?.career ?? {};
  const hobbies: string[] = Array.isArray(p?.hobbies)
    ? typeof p.hobbies[0] === "string"
      ? p.hobbies
      : p.hobbies.map((h: any) => h?.hobby ?? String(h))
    : [];

  const pic = basic?.profile_picture || basic?.profilepic || "https://i.pinimg.com/736x/ff/14/a0/ff14a0b3a565567f03f47147f50b64e8.jpg";
  const cover = basic?.cover_picture || pic;
  const name = basic?.fullname || basic?.nickname || p?.username || "Member";
  const [followState, setFollowState] = useState<"Follow" | "Following">("Follow");

  const toggleFollow = async () => {
    if (!p?.profileid) return;
    try {
      if (followState === "Follow") {
        await followUser(p.profileid);
        setFollowState("Following");
      } else {
        await unfollowUser(p.profileid);
        setFollowState("Follow");
      }
    } catch {}
  };

  const startChat = async () => {
    try {
      await createThread(p?.other_user_id ?? p?.userid ?? p?.id);
      (navigation as any).navigate("Chats");
    } catch {}
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar translucent hidden={false} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground source={{ uri: cover }} style={{ width, height: height * 0.32 }} resizeMode="cover">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mt-12 ml-4 w-11 h-11 rounded-full bg-black/50 items-center justify-center">
            <Ionicons name="arrow-back" size={22} color="white" />
          </TouchableOpacity>
        </ImageBackground>
        <View style={{ marginTop: -60 }} className="px-screen">
          <View className="flex-row items-end gap-mid">
            <Image source={{ uri: pic }} style={{ width: 110, height: 110, borderRadius: 60, borderWidth: 3, borderColor: "#0066FF" }} />
            <View className="flex-1 pb-1">
              <Heading text={name} />
              {basic?.nickname ? <SubHeading text={`@${basic.nickname}`} /> : null}
              {typeof p?.score === "number" ? (
                <Text className="font-Poppinsmedium text-primaryblue">{Math.round(p.score * 100)}% match</Text>
              ) : null}
            </View>
          </View>
          <View className="flex-row gap-mid mt-3">
            <TouchableOpacity onPress={toggleFollow} className="bg-primaryred px-6 py-2 rounded-2xl">
              <Text className="font-Poppinsmedium text-background">{followState}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={startChat} className="border border-primaryblue px-6 py-2 rounded-2xl">
              <Text className="font-Poppinsmedium text-primaryblue">Message</Text>
            </TouchableOpacity>
          </View>
          {basic?.bio ? (
            <View className="mt-3">
              <Describe text={basic.bio} />
            </View>
          ) : null}

          {hobbies.length > 0 ? (
            <View className="mt-4">
              <Title text="Hobbies" />
              <View className="flex-row flex-wrap gap-2 mt-2">
                {hobbies.map((h) => (
                  <View key={h} className="bg-black px-4 py-2 rounded-2xl">
                    <Describe text={h} />
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          <View className="mt-4">
            <Title text="Basic Info" />
            <Row label="Full name" value={basic?.fullname} />
            <Row label="Gender" value={basic?.gender} />
            <Row label="Date of birth" value={basic?.date_of_birth} />
            <Row label="Profile for" value={basic?.profile_handler} />
          </View>

          <View className="mt-4">
            <Title text="Location & Personal" />
            <Row label="Country" value={personal?.current_living_country} />
            <Row label="City" value={personal?.current_city} />
            <Row label="Residency" value={personal?.residency_status} />
            <Row label="Marital status" value={personal?.maritalstatus} />
            <Row label="Gotra" value={personal?.gotra} />
          </View>

          <View className="mt-4">
            <Title text="Additional" />
            <Row label="Height" value={additional?.height} />
            <Row label="Weight" value={additional?.weight} />
            <Row label="Religion" value={additional?.religion} />
            <Row label="Diet" value={additional?.diet} />
            <Row label="Community" value={additional?.community} />
          </View>

          <View className="mt-4 mb-8">
            <Title text="Career" />
            <Row label="Qualification" value={career?.highest_qualification} />
            <Row label="College" value={career?.college_name} />
            <Row label="Working as" value={career?.working_as} />
            <Row label="Occupation" value={career?.occupation} />
            <Row label="Organization" value={career?.company_or_organization_name} />
            {p?.username ? <Row label="Username" value={p.username} /> : null}
            {p?.profileid ? <Row label="Profile ID" value={p.profileid} /> : null}
            <View className="mt-4">
              <SubTitle text="Tip: swipe right or use back to return to matches." />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default UserDetails
