import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Chats,
  Home,
  Notification,
  Profile,
  Search,
  Match
} from "@/src/screens/main/mainScreenLayouts";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const MyTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 70,
          backgroundColor: "#F2F1FF",
          borderTopWidth: 0,
          paddingBottom: 10,
          paddingTop: 15,
          alignItems: 'center',
          justifyContent: 'center'
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 70,
              }}
            >
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={focused ? "#FF000E" : "#7B7B7B"}
              />
              {focused ? (
                <Text
                  className={`font-Poppinsregular text-[12px] ${focused ? "text-primaryred" : "text-darkvariant"}`}
                >
                  Home
                </Text>
              ) : null}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Notification"
        component={Notification}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 80,
              }}
            >
              <Ionicons
                name={focused ? "notifications" : "notifications-outline"}
                size={24}
                color={focused ? "#FF000E" : "#7B7B7B"}
              />
              {focused ? (
                <Text
                  className={`font-Poppinsregular text-[12px] ${focused ? "text-primaryred" : "text-darkvariant"}`}
                >
                  Notification
                </Text>
              ) : null}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Match"
        component={Match}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 80,
              }}
            >
              <Ionicons
                name={focused ? "heart" : "heart-outline"}
                size={24}
                color={focused ? "#FF000E" : "#7B7B7B"}
              />
              {focused ? (
                <Text
                  className={`font-Poppinsregular text-[12px] ${focused ? "text-primaryred" : "text-darkvariant"}`}
                >
                  Match
                </Text>
              ) : null}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 50,
              }}
            >
              <Ionicons
                name={focused ? "search" : "search-outline"}
                size={24}
                color={focused ? "#FF000E" : "#7B7B7B"}
              />
              {focused ? (
                <Text
                  className={`font-Poppinsregular text-[12px] ${focused ? "text-primaryred" : "text-darkvariant"}`}
                >
                  Search
                </Text>
              ) : null}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Chats"
        component={Chats}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 40,
              }}
            >
              <Ionicons
                name={focused ? "chatbox" : "chatbox-outline"}
                size={24}
                color={focused ? "#FF000E" : "#7B7B7B"}
              />
              {focused ? (
                <Text
                  className={`font-Poppinsregular text-[12px] ${focused ? "text-primaryred" : "text-darkvariant"}`}
                >
                  Chats
                </Text>
              ) : null}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 50,
              }}
            >
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={24}
                color={focused ? "#FF000E" : "#7B7B7B"}
              />
              {focused ? (
                <Text
                  className={`font-Poppinsregular text-[12px] ${focused ? "text-primaryred" : "text-darkvariant"}`}
                >
                  Profile
                </Text>
              ) : null}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MyTabs;
