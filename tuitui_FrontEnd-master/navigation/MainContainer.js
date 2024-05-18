import * as React from "react";
import { View, Text } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

// Screens
import HomeScreen from "./screens/HomeScreen";
import MapScreen from "./screens/MapScreen";
import CameraScreen from "./screens/CameraScreen";
import AlarmScreen from "./screens/AlarmScreen";
import ChatScreen from "./screens/ChatScreen";

// Screen names
const homeName = "홈";
const mapName = "지도";
const cameraName = "카메라";
const alarmName = "알림";
const chatName = "채팅";

const Tab = createBottomTabNavigator();

export default function MainContainer() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={homeName}
        screenOptions= {({ route }) => ({
          tabBarActiveTintColor: '#89c6fc',
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === homeName) {
              iconName = focused ? "home" : "home-outline";
            } else if (rn === mapName) {
              iconName = focused ? "map" : "map-outline";
            } else if (rn === cameraName) {
              iconName = focused ? "camera" : "camera-outline";
            } else if (rn === alarmName) {
              iconName = focused ? "alarm" : "alarm-outline";
            } else if (rn === chatName) {
              iconName = focused ? "chatbox" : "chatbox-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name={homeName} component={HomeScreen} options={{ headerShown : false }}/>
        <Tab.Screen name={mapName} component={MapScreen} options={{ headerShown : false }}/>
        <Tab.Screen name={cameraName} component={CameraScreen} options={{ headerShown : false }}/>
        <Tab.Screen name={alarmName} component={AlarmScreen} options={{ headerShown : false }}/>
        <Tab.Screen name={chatName} component={ChatScreen} options={{ headerShown : false }}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
