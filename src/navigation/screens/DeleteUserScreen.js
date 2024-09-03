import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { refreshToken } from '../../../Components/refreshToken';

export default function DeleteUserScreen() {
  const navigation = useNavigation();
  const baseUrl = "https://tuituiworld.store:8443"; // baseUrl 설정

  const handleDeleteAccount = async () => {
    Alert.alert(
      "계정 탈퇴",
      "정말로 탈퇴하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel"
        },
        {
          text: "탈퇴",
          onPress: async () => {
            try {
              let accessToken = await AsyncStorage.getItem('accessToken');
              let userId = await AsyncStorage.getItem('userId'); 
              let account = await AsyncStorage.getItem('account');  

              console.log("Access Token:", accessToken);
              console.log("User ID:", userId);
              console.log("account:", account);

              const tryRequest = async (token) => {
                const response = await fetch(`${baseUrl}/api/users`, {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    userId: userId,
                    account: account,
                  }),
                });

                if (response.status === 401) {
                  // 액세스 토큰이 만료된 경우 리프레시 토큰으로 새 액세스 토큰을 발급받음
                  token = await refreshToken();
                  return tryRequest(token); // 새 액세스 토큰으로 재시도
                } else if (response.status === 403) {
                  Alert.alert("권한 오류", "계정을 삭제할 권한이 없습니다. 관리자에게 문의하십시오.");
                } else {
                  const responseBody = await response.text();
                  if (response.ok) {
                    Alert.alert("탈퇴 완료", "계정이 성공적으로 삭제되었습니다.");
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "Login" }],
                    });
                  } else {
                    Alert.alert("오류", `계정 탈퇴에 실패했습니다: ${responseBody}`);
                    console.error("오류 발생", response, responseBody);
                  }
                }
              };

              await tryRequest(accessToken);

            } catch (error) {
              console.error("오류 발생", error);
              Alert.alert("오류", "계정 탈퇴 중 오류가 발생했습니다.");
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>탈퇴</Text>
      <TouchableOpacity style={styles.button} onPress={handleDeleteAccount}>
        <Text style={styles.buttonText}>탈퇴하기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
