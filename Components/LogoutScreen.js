import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function LogoutScreen() {
  const navigation = useNavigation();
  const baseUrl = "https://tuituiworld.store"; // baseUrl 설정

  const handleLogout = async () => {
    Alert.alert(
      "로그아웃",
      "정말로 로그아웃 하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "로그아웃",
          onPress: async () => {
            try {
              // 서버에 로그아웃 API 호출 (필요한 경우)
              let accessToken = await AsyncStorage.getItem("accessToken");
              if (accessToken) {
                const response = await fetch(`${baseUrl}/api/logout`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                  },
                });

                if (!response.ok) {
                  const responseBody = await response.text();
                  Alert.alert(
                    "오류",
                    `로그아웃 요청에 실패했습니다: ${responseBody}`
                  );
                  return;
                }
              }

              // 로그아웃 시 AsyncStorage의 모든 정보 삭제
              await AsyncStorage.clear();

              // 로그인 화면으로 이동
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });

              Alert.alert("로그아웃 완료", "성공적으로 로그아웃 되었습니다.");
            } catch (error) {
              console.error("오류 발생", error);
              Alert.alert("오류", "로그아웃 중 오류가 발생했습니다.");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>로그아웃</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>로그아웃</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
