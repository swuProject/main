import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

// font
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from "react-native-vector-icons/Ionicons";

// Screens
import HomeScreen from "./screens/HomeScreen";
import MapScreen from "./screens/MapScreen";
import CameraScreen from "./screens/CameraScreen";
import AlarmScreen from "./screens/AlarmScreen";
import ChatScreen from "./screens/ChatScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ProfileOptionScreen from "./screens/PrifileOptionScreen";
import ProfileFixScreen from "./screens/PrifileFixScreen";

// Screen names
const homeName = "home";
const mapName = "Map";
const cameraName = "Camera";
const alarmName = "Alarm";
const chatName = "Chat";

// navigatorStack
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const MapStack = createStackNavigator();
const CameraStack = createStackNavigator();
const AlramStack = createStackNavigator();
const ChatStack = createStackNavigator();

// 홈 스택화면 (프로필 화면)
const HomeStackScreen = ({ navigation }) => {
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const storedNickname = await AsyncStorage.getItem('nickname');
        if (storedNickname) {
          setNickname(storedNickname);
        }
      } catch (error) {
        console.error('닉네임 불러오기 오류:', error);
      }
    };
    fetchNickname();
  }, []);

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
          headerLeft: () => (
            <Text style={styles.headerTitle}>TuiTui</Text>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={goToProfile} style={styles.headerIconButton}>
              <FontAwesome name="user-o" size={24} color="black"/>
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
          headerLeft: () => (
            <View style={styles.headerLeft}>
              <Text style={styles.nickname}>{nickname}</Text>
            </View>
          ),
          headerRight: () => (
            <View style={styles.profileContainer}>
              <TouchableOpacity onPress={goToProfileFix} style={styles.iconButton}>
                <MaterialCommunityIcons name="pencil" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={goToProfileOption} style={styles.iconButton}>
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
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: 'bold',
          },
          headerBackImage: () => (
            <Ionicons 
              name="chevron-back-outline" 
              size={24} 
              color="black" 
              style={{ paddingLeft: 10 }}
            />
          ),
          headerBackTitleVisible: false }}
      />
      <HomeStack.Screen
        name="ProfileOption"
        component={ProfileOptionScreen}
        options={{ 
          title: "설정",
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: 'bold',
          },
          headerBackImage: () => (
            <Ionicons 
              name="chevron-back-outline" 
              size={24} 
              color="black" 
              style={{ paddingLeft: 10 }}
            />
          ),
          headerBackTitleVisible: false }}
      />
    </HomeStack.Navigator>
  );
};

const MainContainer = () => {
  return (
    <Tab.Navigator
      initialRouteName={homeName}
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#89a6fc',
        tabBarInactiveTintColor: '#000000',
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;

          if (rn === homeName) {
            iconName = focused ? "home" : "home-outline";
          } else if (rn === mapName) {
            iconName = focused ? "map" : "location-outline";
          } else if (rn === cameraName) {
            iconName = focused ? "camera" : "camera-outline";
          } else if (rn === alarmName) {
            iconName = focused ? "alarm" : "notifications-outline";
          } else if (rn === chatName) {
            iconName = focused ? "chatbox" : "chatbox-ellipses-outline";
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
      <Tab.Screen name={mapName} component={MapScreen} />
      <Tab.Screen name={cameraName} component={CameraScreen} />
      <Tab.Screen name={alarmName} component={AlarmScreen} />
      <Tab.Screen name={chatName} component={ChatScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 32,
    marginLeft: 16,
    letterSpacing: 8,
  },
  nickname: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  iconButton: {
    marginLeft: 15,
  },
  headerIconButton: {
    marginRight: 16,
  },
});

export default MainContainer;
