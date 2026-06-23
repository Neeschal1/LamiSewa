import {
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { FC, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Describe,
  Description,
  MainScreenName,
  SubHeading,
  SubTitle,
  Title,
} from "@/src/components/systemComponentsLayout";
import { Ionicons } from "@expo/vector-icons";

const myProfile = require("@/src/assets/images/myPP.png");

const { width } = Dimensions.get("window");

const STORY_SIZE = width * 0.18;
const BORDER_SIZE = STORY_SIZE + 8;
const PLUS_SIZE = STORY_SIZE * 0.35;

const Stories = [
  {
    item: 1,
    photo:
      "https://i.pinimg.com/736x/5a/fe/ea/5afeea9ea22e4c1a34b9a8aa3941fdd0.jpg",
    name: "Preeti",
    storyavailable: true,
  },
  {
    item: 2,
    photo:
      "https://i.pinimg.com/736x/a2/5f/98/a25f98dd08b3f7f2e304b968b774f3c4.jpg",
    name: "Shyana",
    storyavailable: true,
  },
  {
    item: 3,
    photo:
      "https://i.pinimg.com/736x/67/c1/d6/67c1d6ddcb6eb37d6920cf732f4d6e80.jpg",
    name: "Adhya",
    storyavailable: true,
  },
  {
    item: 4,
    photo:
      "https://i.pinimg.com/1200x/7e/23/5e/7e235ea15aa159c2d8af1736c353ec8b.jpg",
    name: "Samy",
    storyavailable: true,
  },
  {
    item: 5,
    photo:
      "https://i.pinimg.com/1200x/f0/9a/b8/f09ab89712b5b407839a5d51be8dc5a4.jpg",
    name: "Sandhya",
    storyavailable: false,
  },
  {
    item: 6,
    photo:
      "https://i.pinimg.com/736x/bb/63/ee/bb63ee7ade682b181071909616196c71.jpg",
    name: "Prakriti",
    storyavailable: false,
  },
  {
    item: 7,
    photo:
      "https://i.pinimg.com/736x/6e/01/47/6e01473a4f4b3a3cab346b92194b41bd.jpg",
    name: "Aayushma",
    storyavailable: false,
  },
];

const Chats: FC = () => {
  const [day, setDay] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar hidden={false} />

      <View className="flex-1 bg-background p-screen">
        <MainScreenName text="Messages" />

        <View className="mt-large gap-mid">
          <Title text="People you’ve followed" />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 4,
              gap: 12,
            }}
          >
            {/* Your Story */}

            <TouchableOpacity className="items-center">
              <View>
                {day ? (
                  <>
                    <View
                      className="border-2 border-primaryblue rounded-full items-center justify-center"
                      style={{
                        width: BORDER_SIZE,
                        height: BORDER_SIZE,
                      }}
                    >
                      <Image
                        source={myProfile}
                        style={{
                          width: STORY_SIZE,
                          height: STORY_SIZE,
                          borderRadius: STORY_SIZE / 2,
                        }}
                      />
                    </View>

                    <View
                      className="bg-primaryred rounded-full absolute items-center justify-center"
                      style={{
                        width: PLUS_SIZE,
                        height: PLUS_SIZE,
                        right: 0,
                        bottom: 0,
                      }}
                    >
                      <SubHeading text="+" />
                    </View>
                  </>
                ) : (
                  <Image
                    source={myProfile}
                    style={{
                      width: BORDER_SIZE,
                      height: BORDER_SIZE,
                      borderRadius: BORDER_SIZE / 2,
                    }}
                  />
                )}
              </View>

              <SubTitle text="You" />
            </TouchableOpacity>

            {/* Other Stories */}

            {Stories.map((story) => (
              <TouchableOpacity key={story.item} className="items-center">
                {story.storyavailable ? (
                  <View
                    className="border-2 border-primaryblue rounded-full items-center justify-center"
                    style={{
                      width: BORDER_SIZE,
                      height: BORDER_SIZE,
                    }}
                  >
                    <Image
                      source={{ uri: story.photo }}
                      style={{
                        width: STORY_SIZE,
                        height: STORY_SIZE,
                        borderRadius: STORY_SIZE / 2,
                      }}
                    />
                  </View>
                ) : (
                  <Image
                    source={{ uri: story.photo }}
                    style={{
                      width: BORDER_SIZE,
                      height: BORDER_SIZE,
                      borderRadius: BORDER_SIZE / 2,
                    }}
                  />
                )}

                <SubTitle text={story.name} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Empty State */}

        <View className="flex-1 items-center justify-center">
          <Description text="No messages" />
        </View>

        <View className="flex w-full items-end justify-end">
          <TouchableOpacity className="p-midscreen w-[15%] rounded-full bg-primaryred">
            <Ionicons name="add" size={30} color="#F2F1FF"/>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Chats;
