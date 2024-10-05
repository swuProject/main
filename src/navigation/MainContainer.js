import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// font
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from "react-native-vector-icons/Ionicons";

// Screens
import HomeScreen from "./screens/HomeScreen";
import MapScreen from "./screens/MapScreen";
import CameraScreen from "./screens/CameraScreen/CameraScreen";
import CameraActive from "./screens/CameraScreen/CameraActive";
import ChatScreen from "./screens/ChatScreen";
import FindScreen from "./screens/FindScreen";
import ProfileScreen from "./screens/ProfileScreen/ProfileScreen";
import ProfileOptionScreen from "./screens/ProfileScreen/PrifileOptionScreen";
import ProfileFixScreen from "./screens/ProfileScreen/PrifileFixScreen";

import CameraStackScreen from "./screens/CameraScreen/CameraScreen";

// Screen names
const homeName = "home";
const mapName = "Map";
const cameraName = "Camera";
const chatName = "Chat";
const findName = "Find";

// navigatorStack
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const MapStack = createStackNavigator();
const CameraStack = createStackNavigator();
const AlramStack = createStackNavigator();
const FindStack = createStackNavigator();

// 홈 스택화면 (프로필 화면)
const HomeStackScreen = ({ navigation }) => {
  const goToProfile = () => {
    navigation.navigate("Profile");
  };

  const goToProfileOption = () => {
    navigation.navigate("ProfileOption");
  };

  const goToProfileFix = () => {
    navigation.navigate("ProfileFix");
  };

  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "", // 홈화면 헤더
          headerBackTitleVisible: false,
          headerLeft: () => <Text style={styles.headerTitle}>TuiTui</Text>,
          headerRight: () => (
            <TouchableOpacity
              onPress={goToProfile}
              style={styles.headerIconButton}
            >
              <FontAwesome name="user-o" size={24} color="black" />
            </TouchableOpacity> // 프로필 화면으로 이동 버튼
          ),
        }}
      />
      <HomeStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "",
          headerBackTitleVisible: false,
          headerLeft: () => <View></View>,
          headerRight: () => (
            <View style={styles.profileContainer}>
              <TouchableOpacity
                onPress={goToProfileFix}
                style={styles.iconButton}
              >
                <MaterialCommunityIcons name="pencil" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={goToProfileOption}
                style={styles.iconButton}
              >
                <Feather name="settings" size={24} color="black" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <HomeStack.Screen
        name="ProfileFix"
        component={ProfileFixScreen}
        options={{
          title: "프로필 수정",
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: "bold",
          },
          headerBackImage: () => (
            <Ionicons
              name="chevron-back-outline"
              size={24}
              color="black"
              style={{ paddingLeft: 10 }}
            />
          ),
          headerBackTitleVisible: false,
        }}
      />
      <HomeStack.Screen
        name="ProfileOption"
        component={ProfileOptionScreen}
        options={{
          title: "설정",
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: "bold",
          },
          headerBackImage: () => (
            <Ionicons
              name="chevron-back-outline"
              size={24}
              color="black"
              style={{ paddingLeft: 10 }}
            />
          ),
          headerBackTitleVisible: false,
        }}
      />
    </HomeStack.Navigator>
  );
};

const MainContainer = () => {
  return (
    <Tab.Navigator
      initialRouteName={homeName}
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "#000000",
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;

          if (rn === homeName) {
            iconName = focused ? "home" : "home-outline";
          } else if (rn === mapName) {
            iconName = focused ? "location" : "location-outline";
          } else if (rn === cameraName) {
            iconName = focused ? "camera" : "camera-outline";
          } else if (rn === chatName) {
            iconName = focused ? "chatbox-ellipses" : "chatbox-ellipses-outline";
          } else if (rn === findName) {
            iconName = focused ? "search" : "search-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name={homeName}
        component={HomeStackScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name={mapName}
        component={MapScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name={cameraName}
        component={CameraStackScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen name={chatName} component={ChatScreen} />
      <Tab.Screen 
        name={findName} 
        component={FindScreen} 
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 32,
    marginLeft: 16,
    letterSpacing: 8,
  },
  iconButton: {
    marginLeft: 15,
  },
  headerIconButton: {
    marginRight: 16,
  },
});

export default MainContainer;
