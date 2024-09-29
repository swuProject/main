// 로그인 화면
import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";

import SplashScreen from "./Components/SplashScreen";
import Loginscreen from "./Components/Loginscreen";
import ProfileCreateScreen from "./Components/ProfileCreateScreen";
import LogoutScreen from "./Components/LogoutScreen";
import DeleteUserScreen from "./Components/DeleteUserScreen";

import MainContainer from "./src/navigation/MainContainer";
import FindScreen from "./src/navigation/screens/FindScreen";
import ProfileOptionScreen from "./src/navigation/screens/ProfileScreen/PrifileOptionScreen";
import ProfileScreen from "./src/navigation/screens/ProfileScreen/ProfileScreen";
import ProfileFixScreen from "./src/navigation/screens/ProfileScreen/PrifileFixScreen";
import ProfileinfoScreen from "./src/navigation/screens/ProfileScreen/ProfileinfoScreen";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="Login"
          component={Loginscreen}
          options={{ headerShown: false, gestureEnabled: false, }}
        />
        <Stack.Screen
          name="ProfileCreate"
          component={ProfileCreateScreen}
          options={{ headerShown: false, gestureEnabled: false, }}
        />
        <Stack.Screen
          name="MainContainer"
          component={MainContainer}
          options={{ headerShown: false, gestureEnabled: false, }}
        />
         <Stack.Screen
          name="Find"
          component={FindScreen}
          options={{ headerShown: false, gestureEnabled: false, }}
        />
        <Stack.Screen
          name="ProfileOptions"
          component={ProfileOptionScreen}
          options={{ title: "설정", }}
        />
        <Stack.Screen
          name="Profileinfo"
          component={ProfileinfoScreen}
          options={{ 
            title: "",
            headerBackTitleVisible: false,
            headerBackImage: () => (
              <Ionicons
                name="chevron-back-outline"
                size={24}
                color="black"
                style={{ paddingLeft: 10 }}
              />
            ),  
          }}
        />
        <Stack.Screen
          name="DeleteUser"
          component={DeleteUserScreen}
          options={{
            title: "탈퇴하기",
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
        <Stack.Screen
          name="Logout"
          component={LogoutScreen}
          options={{
            title: "로그아웃",
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
        <Stack.Screen 
          name="ProfileScreen" 
          component={ProfileScreen} 
        />
        <Stack.Screen 
          name="ProfileFixScreen" 
          component={ProfileFixScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
