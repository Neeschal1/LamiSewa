import {
  View,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  Image,
  Dimensions,
  Text,
  Touchable,
  ScrollView,
  Pressable,
  Linking,
  Switch,
  RefreshControl,
} from "react-native";
import React, { FC, useEffect, useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Describe,
  Description,
  Heading,
  MainScreenName,
  SecondaryButton,
  SubHeading,
  SubText,
  SubTitle,
  Title,
} from "@/src/components/systemComponentsLayout";
import {
  NavigationProps,
  RootStackParamList,
} from "@/src/components/componentsType";
import { useNavigation } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Modal from "react-native-modal";
import { useAuth } from "@/src/auth/AuthContext";
import { useProfile } from "@/src/profile/ProfileProvider";
import { fetchFollowers, fetchFollowing } from "@/src/services/privacy/follow";
import { fetchSubscriptionStatus } from "@/src/services/payments/subscription";
import { fetchStories, fetchStoryViewers, uploadStory } from "@/src/services/profile/stories";
import { updateOwnProfile } from "@/src/services/profile/updateProfile";
import UploadImages from "@/src/utils/uploadImages";
import QRCode from "react-native-qrcode-svg";

type OthersScreen =
  | "PrivacyPolicy"
  | "TermsOfUse"
  | "Help"
  | "ContactUs"
  | "Documents" 
  | "AboutUs"

type AccountType = {
  item: number;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  btnname: string;
  headto: keyof RootStackParamList;
};

type OthersType = {
  item: number;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  btnname: string;
  redirect: OthersScreen;
};

interface Profile {
  useremail: string;
  username: string;
  profileid: string;
  userid: number;
}

interface BasicInfo {
  fullname: string;
  nickname: string;
  bio: string;
  profile_picture: string;
  cover_picture: string;
  profile_handler: string;
  gender: string;
  date_of_birth: string;
}

interface UserData {
  profile: Profile;
  basic_info: BasicInfo;
  personal_info?: Record<string, any>;
  additional_info?: Record<string, any>;
  career_info?: Record<string, any>;
  hobbies?: Record<string, any>;
  featured_images?: Record<string, any>;
}

const CoverPP = require("@/src/assets/images/cover.png");
const myProfile = require("@/src/assets/images/myPP.png");

const Verification = require("@/src/assets/icons/verified.png");

const FeaturePhotoes = [
  { item: 1, image: require("@/src/assets/images/feature1.png") },
  { item: 2, image: require("@/src/assets/images/feature2.png") },
  { item: 3, image: require("@/src/assets/images/feature3.png") },
  { item: 4, image: require("@/src/assets/images/feature4.png") },
  { item: 5, image: require("@/src/assets/images/feature5.png") },
  { item: 6, image: require("@/src/assets/images/feature6.png") },
];

const Accounts: AccountType[] = [
  {
    item: 1,
    icon: "person",
    btnname: "Edit Profile",
    headto: "EditProfile",
  },
  {
    item: 2,
    icon: "checkmark-circle",
    btnname: "Verify your ID",
    headto: "Intro",
  },
  {
    item: 3,
    icon: "lock-closed",
    btnname: "Change Password",
    headto: "ChangePassword",
  },
  { item: 4, icon: "earth", btnname: "Language", headto: "Language" },
];

const Others: OthersType[] = [
  {
    item: 1,
    icon: "shield-checkmark",
    btnname: "Privacy Policy",
    redirect: "PrivacyPolicy",
  },
  {
    item: 2,
    icon: "newspaper",
    btnname: "Terms of Use",
    redirect: "TermsOfUse",
  },
  {
    item: 3,
    icon: "information-circle",
    btnname: "Help",
    redirect: "Help",
  },
  {
    item: 4,
    icon: "people-circle",
    btnname: "Contact Us",
    redirect: "ContactUs",
  },
  {
    item: 5,
    icon: "accessibility-outline",
    btnname: "About Us",
    redirect: "AboutUs",
  },
];

const { width, height } = Dimensions.get("window");

const Profile: FC = () => {
  const { logout } = useAuth();
  const { data: cached, fetchProfile, refreshProfile } = useProfile();
  const userData: UserData | null = cached;
  const [enabled, setEnabled] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [shareVisible, setShareVisible] = useState<boolean>(false);
  const [subscription, setSubscription] = useState<any | null>(null);
  const [packageVisible, setPackageVisible] = useState<boolean>(false);
  const [myStory, setMyStory] = useState<any | null>(null);
  const [avatarOptions, setAvatarOptions] = useState<boolean>(false);
  const [avatarViewer, setAvatarViewer] = useState<boolean>(false);
  const [viewers, setViewers] = useState<any[]>([]);
  const [viewersVisible, setViewersVisible] = useState<boolean>(false);
  const [uploadingAvatar, setUploadingAvatar] = useState<boolean>(false);
  const [coverOptions, setCoverOptions] = useState<boolean>(false);
  const [coverViewer, setCoverViewer] = useState<boolean>(false);
  const [deleteCoverConfirm, setDeleteCoverConfirm] = useState<boolean>(false);
  const [uploadingCover, setUploadingCover] = useState<boolean>(false);

  const navigation = useNavigation<NavigationProps>();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshProfile();
    } catch {}
    try {
      setFollowers(await fetchFollowers());
    } catch {}
    try {
      setFollowing(await fetchFollowing());
    } catch {}
    try {
      const sub = await fetchSubscriptionStatus();
      setSubscribed(!!sub?.is_subscribed);
      setSubscription(sub?.is_subscribed ? sub : null);
    } catch {}
    setRefreshing(false);
  }, [refreshProfile]);

  const openViewers = async () => {
    if (!myStory?.id) return;
    try {
      setViewers(await fetchStoryViewers(myStory.id));
    } catch {
      setViewers([]);
    }
    setViewersVisible(true);
  };

  const pickAvatarImage = async (afterPick: (url: string) => Promise<void>) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8 });
    if (result.canceled) return;
    setUploadingAvatar(true);
    try {
      const url = await UploadImages(result.assets[0].uri);
      if (url) await afterPick(url);
    } catch {
    } finally {
      setUploadingAvatar(false);
    }
  };

  const uploadAvatarAsStory = async () => {
    setAvatarOptions(false);
    await pickAvatarImage(async (url) => {
      try {
        const saved = await uploadStory(url);
        if (saved?.has_story) setMyStory(saved);
      } catch {}
    });
  };

  const uploadNewAvatar = async () => {
    setAvatarOptions(false);
    await pickAvatarImage(async (url) => {
      try {
        await updateOwnProfile({ basic_info: { profile_picture: url } });
        await refreshProfile();
      } catch {}
    });
  };

  const updateCoverPhoto = async () => {
    setCoverOptions(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8 });
    if (result.canceled) return;
    setUploadingCover(true);
    try {
      const url = await UploadImages(result.assets[0].uri);
      if (url) {
        await updateOwnProfile({ basic_info: { cover_picture: url } });
        await refreshProfile();
      }
    } catch {
    } finally {
      setUploadingCover(false);
    }
  };

  const deleteCoverPhoto = async () => {
    setDeleteCoverConfirm(false);
    setCoverOptions(false);
    setUploadingCover(true);
    try {
      await updateOwnProfile({ basic_info: { cover_picture: "__default__" } });
      await refreshProfile();
    } catch {
    } finally {
      setUploadingCover(false);
    }
  };

  const handleLogOut = async () => {
    await logout();
  };

useEffect(() => {
  const loadAll = async () => {
    let fresh: any = null;
    try {
      fresh = await fetchProfile();
    } catch {}
    const [f1, f2, sub, storyList] = await Promise.all([
      fetchFollowers().catch(() => []),
      fetchFollowing().catch(() => []),
      fetchSubscriptionStatus().catch(() => null),
      fetchStories().catch(() => []),
    ]);
    setFollowers(f1);
    setFollowing(f2);
    setSubscribed(!!(sub as any)?.is_subscribed);
    setSubscription((sub as any)?.is_subscribed ? sub : null);
    const pid = (fresh as any)?.profile?.profileid;
    const mine = (storyList as any[]).find((s: any) => s.profileid === pid);
    if (mine?.has_story) setMyStory(mine);
  };
  loadAll();
}, [fetchProfile]);

const profileLink = userData?.profile?.profileid
  ? `lamisewa://profile/${userData.profile.profileid}`
  : "";
const featuredUrls: string[] = Array.isArray((userData as any)?.featured_urls)
  ? (userData as any).featured_urls
  : [];

  return (
    <View className="flex-1 items-center justify-start bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{
          alignItems: "center",
        }}
      >
        <StatusBar hidden={false} translucent />

        <Pressable onPress={() => setCoverOptions(true)}>
          <ImageBackground
            source={{ uri: userData?.basic_info.cover_picture }}
            style={{
              width: width,
              height: height * 0.22,
            }}
            className="items-end pt-10 pr-6 w-full flex-end"
            resizeMode="cover"
          >
            <View className="flex w-full justify-end pt-4 items-end flex-row gap-small" pointerEvents="box-none">
              {subscribed ? (
                <TouchableOpacity
                  onPress={() => setPackageVisible(true)}
                  className="w-12 h-12 rounded-full bg-[#2277F7] items-center justify-center"
                >
                  <Ionicons name="diamond" size={24} color="#F2F1FF" />
                </TouchableOpacity>
              ) : null}
            <TouchableOpacity className="flex items-center justify-center bg-background w-12 h-12 rounded-full">
              <Ionicons name="menu" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShareVisible(true)}
              className="flex items-center justify-center bg-background w-12 h-12 rounded-full"
            >
              <Ionicons name="share-social-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </ImageBackground>
        </Pressable>

        <View
          style={{
            marginTop: -height * 0.1,
          }}
          className="flex-row items-center justify-between w-full p-screen"
        >
          <View className="flex flex-col w-full items-center gap-mid">
            <Pressable
              onPress={() => setAvatarOptions(true)}
              style={{
                width: width * 0.35,
                height: width * 0.35,
                borderRadius: (width * 0.25) / 2,
                overflow: "hidden",
              }}
            >
              <View
                className="flex py-2 px-2 bg-background rounded-full"
                style={myStory?.has_story ? { borderWidth: 4, borderColor: "#0066FF" } : undefined}
              >
                <Image
                  source={{ uri: userData?.basic_info.profile_picture }}
                  style={{
                    width: "100%",
                    height: "100%",
                    resizeMode: "cover",
                    borderRadius: 100,
                  }}
                />
              </View>
            </Pressable>
            <View className="gap-small w-full items-center">
              <View className="flex items-center">
                <View className="flex flex-row items-center justify-center gap-small">
                  <Text className="font-Poppinssemibold text-dark text-[24px]">
                    {userData?.basic_info.fullname}
                  </Text>
                  {subscribed ? <Image source={Verification} /> : null}
                </View>
                <View className="flex mt-[-10px]">
                  {/* <Description text={`${userData?.career_info.occupation}`}/> */}
                </View>
              </View>
              <SubTitle text={`${userData?.basic_info.bio}`} />
              <View className="flex flex-row gap-mid">
                <TouchableOpacity
                  onPress={() => navigation.navigate("Followers")}
                  className="flex bg-[#FFFFFF] px-4 py-2 rounded-2xl"
                >
                  <SubTitle text={`Followers: ${followers.length}`} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Following")}
                  className="flex bg-primaryred px-4 py-2 rounded-2xl"
                >
                  <Text className="font-Poppinsregular text-background text-subheading">
                    {`Following: ${following.length}`}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {subscribed ? null : (
          <View className="flex py-4">
            <TouchableOpacity
              onPress={() => navigation.navigate("SubscriptionDetails", { from: "Profile" })}
              className="flex flex-row bg-[#9621C5] items-center gap-mid w-full px-20 rounded-xl py-4"
            >
              <Ionicons name="diamond" color="white" size={24} />
              <Text className="font-Poppinsmedium text-background text-subheading">
                Purchase Membership
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="flex items-start w-full p-screen">
          <View className="flex justify-between flex-row w-full">
            <Description text="Your Pictures" />
            <TouchableOpacity className="mr-2" onPress={() => navigation.navigate("FeaturedPhoto")}>
              <SubText text="Tap to Edit" />
            </TouchableOpacity>
          </View>
          {featuredUrls.length === 0 ? (
            <Pressable
              onPress={() => navigation.navigate("FeaturedPhoto")}
              className="flex items-center justify-center w-full bg-[#ecebff] rounded-2xl border-[#FFFFFF]"
            >
              <View className="flex items-center justify-center py-14">
                <Ionicons name="camera" size={30} />
                <SubTitle text="Choose from Gallery" />
              </View>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => navigation.navigate("FeaturedPhoto")}
              className="flex w-full flex-row flex-wrap justify-between bg-[#ecebff] rounded-2xl border-[#FFFFFF] p-2"
            >
              {featuredUrls.slice(0, 6).map((uri) => (
                <Image
                  key={uri}
                  source={{ uri }}
                  className="rounded-2xl mb-2"
                  style={{ width: "31%", aspectRatio: 3 / 4 }}
                  resizeMode="cover"
                />
              ))}
            </Pressable>
          )}
        </View>

        <View className="flex w-full items-start p-screen">
          <Description text="Profile Details" />
          <View className="mt-2 w-full gap-small">
            <View className="flex flex-row justify-between w-full">
              <SubTitle text="Username" />
              <Description text={`@${userData?.profile?.username ?? "-"}`} />
            </View>
            <View className="flex flex-row justify-between w-full">
              <SubTitle text="Profile ID" />
              <Description text={`${userData?.profile?.profileid ?? "-"}`} />
            </View>
            <View className="flex flex-row justify-between w-full">
              <SubTitle text="Gender" />
              <Description text={`${userData?.basic_info?.gender ?? "-"}`} />
            </View>
            <View className="flex flex-row justify-between w-full">
              <SubTitle text="City" />
              <Description text={`${userData?.personal_info?.current_city ?? "-"}`} />
            </View>
            <View className="flex flex-row justify-between w-full">
              <SubTitle text="Country" />
              <Description text={`${userData?.personal_info?.current_living_country ?? "-"}`} />
            </View>
            <View className="flex flex-row justify-between w-full">
              <SubTitle text="Marital status" />
              <Description text={`${userData?.personal_info?.maritalstatus ?? "-"}`} />
            </View>
            <View className="flex flex-row justify-between w-full">
              <SubTitle text="Religion" />
              <Description text={`${userData?.additional_info?.religion ?? "-"}`} />
            </View>
            <View className="flex flex-row justify-between w-full">
              <SubTitle text="Occupation" />
              <Description text={`${(userData?.career_info as any)?.occupation ?? "-"}`} />
            </View>
            <View className="flex flex-row justify-between w-full">
              <SubTitle text="Organization" />
              <Description text={`${(userData?.career_info as any)?.company_or_organization_name ?? "-"}`} />
            </View>
          </View>
          {userData?.hobbies ? (
            <View className="flex flex-row flex-wrap gap-2 mt-3">
              {Object.values(userData.hobbies).map((h: any) => (
                <View key={String(h)} className="bg-[#ecebff] px-4 py-2 rounded-2xl">
                  <SubTitle text={String(h)} />
                </View>
              ))}
            </View>
          ) : null}
        </View>

        <View className="flex w-full items-start p-screen">
          <Description text="Account" />
          <View className="mt-4 gap-mid">
            {Accounts.map((index) => (
              <TouchableOpacity
                key={index.item}
                className="flex flex-row justify-between w-full"
                onPress={()=>{navigation.navigate(index.headto as never)}}
              >
                <View className="flex flex-row gap-mid">
                  <Ionicons name={index.icon} size={24} />
                  <SubTitle text={index.btnname} />
                </View>
                <Ionicons
                  name="chevron-forward-outline"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="flex w-full items-start p-screen">
          <Description text="Notification" />
          <View className="gap-mid w-full flex-row items-center justify-between">
            <View className="flex flex-row gap-mid">
              <Ionicons name="notifications" size={24} color="black" />
              <SubTitle text="App Notification" />
            </View>
            <Switch
              value={enabled}
              onValueChange={setEnabled}
              trackColor={{ false: "#BBBDC8", true: "#FF000E" }}
              thumbColor={enabled ? "#FFFFFF" : "#FFFFFF"}
            />
          </View>
        </View>

        <View className="flex w-full items-start p-screen">
          <Description text="Others" />
          <View className="mt-4 gap-mid w-full">
            {Others.map((index) => (
              <TouchableOpacity
                onPress={() => {
                  console.log("Redirect:", index.redirect);
                  navigation.navigate(index.redirect);
                }}
                key={index.item}
                className="flex flex-row w-full gap-mid"
              >
                <View className="flex flex-row gap-mid">
                  <Ionicons name={index.icon} size={24} />
                  <SubTitle text={index.btnname} />
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={async () => {
                await logout();
              }}
              className="flex flex-row w-full gap-mid"
            >
              <View className="flex flex-row gap-mid">
                <Ionicons name="log-out" size={24} />
                <SubTitle text="Log Out" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex flex-row gap-4"></View>
      </ScrollView>
      <Modal
        isVisible={shareVisible}
        onBackdropPress={() => setShareVisible(false)}
        onBackButtonPress={() => setShareVisible(false)}
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <View className="bg-background rounded-t-3xl p-screen items-center gap-large">
          <View className="w-12 h-1.5 rounded-full bg-darkvariant/40" />
          <SubTitle text="Share your profile" />
          {profileLink ? <QRCode value={profileLink} size={180} /> : null}
          {profileLink ? <Description text={profileLink} /> : null}
          <TouchableOpacity
            onPress={() => setShareVisible(false)}
            className="bg-primaryred rounded-2xl py-3 px-10"
          >
            <Text className="font-Poppinsmedium text-background">Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        isVisible={avatarOptions}
        onBackdropPress={() => setAvatarOptions(false)}
        onBackButtonPress={() => setAvatarOptions(false)}
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <View className="bg-background rounded-t-3xl p-screen items-center gap-large">
          <View className="w-12 h-1.5 rounded-full bg-darkvariant/40" />
          <SubTitle text="Profile photo" />
          <View className="w-full gap-mid">
            <TouchableOpacity onPress={uploadAvatarAsStory} className="flex-row items-center gap-mid py-3 border-b border-darkvariant/10">
              <Ionicons name="add-circle-outline" size={24} color="black" />
              <SubTitle text={uploadingAvatar ? "Uploading..." : "Add to story"} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setAvatarOptions(false);
                setAvatarViewer(true);
              }}
              className="flex-row items-center gap-mid py-3 border-b border-darkvariant/10"
            >
              <Ionicons name="eye-outline" size={24} color="black" />
              <SubTitle text="View profile picture" />
            </TouchableOpacity>
            <TouchableOpacity onPress={uploadNewAvatar} className="flex-row items-center gap-mid py-3">
              <Ionicons name="camera-outline" size={24} color="black" />
              <SubTitle text="Upload profile picture" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => setAvatarOptions(false)}
            className="bg-primaryred rounded-2xl py-3 px-10"
          >
            <Text className="font-Poppinsmedium text-background">Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        isVisible={avatarViewer}
        onBackdropPress={() => setAvatarViewer(false)}
        onBackButtonPress={() => setAvatarViewer(false)}
        style={{ margin: 0 }}
      >
        <View className="flex-1 bg-black items-center justify-center">
          <Image
            source={{ uri: userData?.basic_info.profile_picture }}
            style={{ width: width * 0.92, height: width * 1.1, borderRadius: 16 }}
            resizeMode="contain"
          />
          <TouchableOpacity
            onPress={() => setAvatarViewer(false)}
            className="absolute top-14 right-6 w-11 h-11 rounded-full bg-black/60 items-center justify-center"
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        isVisible={viewersVisible}
        onBackdropPress={() => setViewersVisible(false)}
        onBackButtonPress={() => setViewersVisible(false)}
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <View className="bg-background rounded-t-3xl p-screen items-center gap-large" style={{ maxHeight: height * 0.6 }}>
          <View className="w-12 h-1.5 rounded-full bg-darkvariant/40" />
          <SubTitle text={`Viewed by ${viewers.length}`} />
          <ScrollView className="w-full" showsVerticalScrollIndicator={false}>
            {viewers.length === 0 ? <Description text="No views yet." /> : null}
            {viewers.map((v: any) => (
              <View key={v.profileid} className="flex-row items-center gap-mid py-2 border-b border-darkvariant/10">
                <Image
                  source={{ uri: v.pic || "https://i.pinimg.com/736x/ff/14/a0/ff14a0b3a565567f03f47147f50b64e8.jpg" }}
                  style={{ width: 44, height: 44, borderRadius: 22 }}
                />
                <View className="flex-1">
                  <SubTitle text={v.name ?? v.username} />
                  <Description text={`@${v.username}`} />
                </View>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            onPress={() => setViewersVisible(false)}
            className="bg-primaryred rounded-2xl py-3 px-10"
          >
            <Text className="font-Poppinsmedium text-background">Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        isVisible={coverOptions}
        onBackdropPress={() => setCoverOptions(false)}
        onBackButtonPress={() => setCoverOptions(false)}
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <View className="bg-background rounded-t-3xl p-screen items-center gap-large">
          <View className="w-12 h-1.5 rounded-full bg-darkvariant/40" />
          <SubTitle text="Cover photo" />
          <View className="w-full gap-mid">
            <TouchableOpacity
              onPress={() => {
                setCoverOptions(false);
                setDeleteCoverConfirm(true);
              }}
              className="flex-row items-center gap-mid py-3 border-b border-darkvariant/10"
            >
              <Ionicons name="trash-outline" size={24} color="#FF000E" />
              <SubTitle text="Delete cover picture" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setCoverOptions(false);
                setCoverViewer(true);
              }}
              className="flex-row items-center gap-mid py-3 border-b border-darkvariant/10"
            >
              <Ionicons name="eye-outline" size={24} color="black" />
              <SubTitle text="View cover picture" />
            </TouchableOpacity>
            <TouchableOpacity onPress={updateCoverPhoto} className="flex-row items-center gap-mid py-3">
              <Ionicons name="camera-outline" size={24} color="black" />
              <SubTitle text={uploadingCover ? "Uploading..." : "Update cover photo"} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => setCoverOptions(false)}
            className="bg-primaryred rounded-2xl py-3 px-10"
          >
            <Text className="font-Poppinsmedium text-background">Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        isVisible={coverViewer}
        onBackdropPress={() => setCoverViewer(false)}
        onBackButtonPress={() => setCoverViewer(false)}
        style={{ margin: 0 }}
      >
        <View className="flex-1 bg-black items-center justify-center">
          <Image
            source={{ uri: userData?.basic_info.cover_picture }}
            style={{ width: width * 0.94, height: height * 0.5, borderRadius: 16 }}
            resizeMode="contain"
          />
          <TouchableOpacity
            onPress={() => setCoverViewer(false)}
            className="absolute top-14 right-6 w-11 h-11 rounded-full bg-black/60 items-center justify-center"
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        isVisible={deleteCoverConfirm}
        onBackdropPress={() => setDeleteCoverConfirm(false)}
        onBackButtonPress={() => setDeleteCoverConfirm(false)}
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <View className="bg-background rounded-t-3xl p-screen items-center gap-large">
          <SubTitle text="Are you sure that you want to delete your cover photo?" />
          <View className="flex-row w-full gap-mid">
            <View className="flex-1">
              <TouchableOpacity
                onPress={deleteCoverPhoto}
                className="bg-primaryred rounded-2xl py-3 items-center"
              >
                <Text className="font-Poppinsmedium text-background">Yes</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-1">
              <TouchableOpacity
                onPress={() => setDeleteCoverConfirm(false)}
                className="border border-darkvariant/40 rounded-2xl py-3 items-center"
              >
                <Text className="font-Poppinsmedium text-dark">No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={packageVisible}
        onBackdropPress={() => setPackageVisible(false)}
        onBackButtonPress={() => setPackageVisible(false)}
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <View className="bg-background rounded-t-3xl p-screen items-center gap-large">
          <View className="w-12 h-1.5 rounded-full bg-darkvariant/40" />
          <SubTitle text="Ongoing package" />
          <View className="w-full gap-small">
            <View className="flex-row justify-between w-full">
              <SubTitle text="Package" />
              <Description text={`${subscription?.package_type ?? "-"}`} />
            </View>
            <View className="flex-row justify-between w-full">
              <SubTitle text="Valid until" />
              <Description text={`${subscription?.expiry_date ? String(subscription.expiry_date).slice(0, 10) : "-"}`} />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setPackageVisible(false)}
            className="bg-primaryred rounded-2xl py-3 px-10"
          >
            <Text className="font-Poppinsmedium text-background">Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default Profile;
