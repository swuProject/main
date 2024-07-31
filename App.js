// import { NavigationContainer } from "@react-navigation/native";
// import MainContainer from "./src/navigation/MainContainer";

// export default function App() {
//   return (
//     <NavigationContainer>
//       <MainContainer />
//     </NavigationContainer>
//   );
// }

// 로그인 화면
import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";

import Loginscreen from "./Components/Loginscreen";
import Registerscreen from "./Components/Registerscreen";
import MainContainer from "./src/navigation/MainContainer";
import ChangePwScreen from "./src/navigation/screens/ChangePwScreen";
import ProfileOptionScreen from "./src/navigation/screens/PrifileOptionScreen";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Loginscreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainContainer"
          component={MainContainer}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Registerscreen}
          options={{
            title: "회원가입",
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
          name="ProfileOptions"
          component={ProfileOptionScreen}
          options={{
            title: "설정",
          }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePwScreen}
          options={{
            title: "비밀번호 변경",
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
