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

import Loginscreen from "./Components/Loginscreen";
import Registerscreen from "./Components/Registerscreen";
import MainContainer from "./src/navigation/MainContainer";

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
          options={{ headerBackTitleVisible: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
