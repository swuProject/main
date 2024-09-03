import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshToken } from './refreshToken';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // 저장된 refreshToken을 가져옴
        const savedRefreshToken = await AsyncStorage.getItem('refreshToken');
        
        if (savedRefreshToken) {
          // refreshToken을 이용해 accessToken 갱신 시도
          const accessToken = await refreshToken();
          
          if (accessToken) {
            // 토큰이 유효하다면 메인 화면으로 이동
            navigation.navigate('MainContainer'); // 'Main' 화면으로 이동
          } else {
            // 토큰 갱신 실패 시 로그인 화면으로 이동
            navigation.navigate('Login');
          }
        } else {
          // 저장된 토큰이 없다면 로그인 화면으로 이동
          navigation.navigate('Login');
        }
      } catch (error) {
        // 에러 발생 시 로그인 화면으로 이동
        navigation.navigate('Login');
      }
    };

    checkAuthStatus();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>TuiTui</Text>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9FD',
  },
  text: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default SplashScreen;
