import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Loginscreen from './Components/Loginscreen';
import Registerscreen from './Components/Registerscreen';
import Homescreen from './Components/Homescreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Loginscreen} options={{headerShown: false}}/>
        <Stack.Screen name="Home" component={Homescreen} options={{headerShown: false}}/>
        <Stack.Screen name="회원가입" component={Registerscreen} options={{headerBackTitleVisible: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;