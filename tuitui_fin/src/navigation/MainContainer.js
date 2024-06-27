import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, View, Text } from "react-native";

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
import { TouchableOpacity } from "react-native-gesture-handler";

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
  //프로파일 화면으로 이동하는 네비게이션 함수
  const goToProfile = (e) => {
    navigation.navigate("Profile");
  };
  //프로파일 옵션화면으로 이동하는 네비게이션 함수
  const goToProfileOption = (e) => {
    navigation.navigate("ProfileOption");
  };
  //프로파일 수정화면으로 이동하는 네비게이션 함수
  const goToProfileFix = (e) => {
    navigation.navigate("ProfileFix");
  };
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "", // 여기가 홈화면 헤더
          headerBackTitleVisible: false,
          headerLeft: () => (
            <Text style={{fontSize:32, marginLeft:16, letterSpacing:8}}>TuiTui</Text>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={goToProfile}>
              <FontAwesome style={{marginRight:16}} name="user-o" size={24} color="black"/>
            </TouchableOpacity> // 프로필 화면으로 이동 버튼
          ),
        }}
      />
      <HomeStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerRight: () => (
            <View style={styles.profileContainer}>
              {/* 프로필 화면 옵션으로 이동 버튼 */}
              <TouchableOpacity onPress={goToProfileFix}>
                <MaterialCommunityIcons name="pencil" size={24} color="black" />
              </TouchableOpacity>
              {/* 프로필 화면 수정으로 이동 버튼 */}
              <TouchableOpacity onPress={goToProfileOption}>
                <Feather name="settings" size={24} color="black" />
              </TouchableOpacity>
            </View>
          ),
        }}
      ></HomeStack.Screen>

      <HomeStack.Screen
        name="ProfileFix"
        component={ProfileFixScreen}
      ></HomeStack.Screen>

      <HomeStack.Screen
        name="ProfileOption"
        component={ProfileOptionScreen}
      ></HomeStack.Screen>
    </HomeStack.Navigator>
  );
};

const MainContainer = () => {
  return (
    <Tab.Navigator
      initialRouteName={homeName}
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#89a6fc',
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
    flexDirection: "row",
    margin: 10,
  },
});

export default MainContainer;
