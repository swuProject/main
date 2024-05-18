import React from 'react';
import { StyleSheet } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Loginscreen from './Components/Loginscreen';
import Registerscreen from './Components/Registerscreen';
import Splashscreen from './Components/Splashscreen';

const Stack = createStackNavigator();

const Auth = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Loginscreen}
        options={{
          title: '',
        }}
      />
      <Stack.Screen
        name="Register"
        component={Registerscreen}
        options={{
          title: '회원가입',
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splashscreen">
        {/* <Stack.Screen
          name="SplashScreen"
          component={Splashscreen}
          options={{headerShown: false}}
        /> */}
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({});

export default App;