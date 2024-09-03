import React, { useState } from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login as kakaoLogin, getProfile as getKakaoProfile } from "@react-native-seoul/kakao-login";

function Loginscreen({ navigation }) {
  const [kakaoLoading, setKakaoLoading] = useState(false);

  // 카카오 로그인 처리
  const handleKakaoLogin = async () => {
    setKakaoLoading(true);
  
    try {
      // 카카오 로그인 요청
      const result = await kakaoLogin();
      if (result) {
        // 카카오 프로필 정보 요청
        const profile = await getKakaoProfile();
  
        // 프로필 정보를 AsyncStorage에 저장
        await AsyncStorage.multiSet([
          ["name", profile.name || ""],
          ["phone", profile.phoneNumber || ""],
          ["account", profile.email || ""],
          ["birthyear", profile.birthyear || ""],
          ["birthday", profile.birthday || ""],
          ["gender", profile.gender || ""],
          ["profileImgPath", profile.profileImageUrl || ""],
        ]);
  
        // API 요청 URL 생성
        const base_url = "https://tuituiworld.store:8443";
        const email = encodeURIComponent(profile.email);
        const token = encodeURIComponent(result.accessToken);
        const apiUrl = `${base_url}/api/token?grant_type=authorization_code&account=${email}&sns_type=kakao&access_token=${token}`;
  
        // 서버에 API 요청 보내기
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        const responseData = await response.json();
  
        // 서버 응답 처리
        if (response.ok) {
          console.log("서버 응답:", responseData);
  
          // Access Token과 Refresh Token을 AsyncStorage에 저장
          if (responseData.data && responseData.data.token) {
            const { accessToken, refreshToken } = responseData.data.token;
            if (accessToken && refreshToken) {
              await AsyncStorage.multiSet([
                ["accessToken", accessToken],
                ["refreshToken", refreshToken],
                ["userId", responseData.data.user.userId.toString()],
              ]);
  
              // 프로필 생성 화면으로 이동
              navigation.navigate("ProfileCreate");
            } else {
              throw new Error("Token data is missing.");
            }
          } else {
            throw new Error("Token data structure is incorrect.");
          }
        } else {
          // 서버 응답 상태가 200이 아니거나 오류가 있는 경우
          console.error("서버 응답:", responseData);
          navigation.navigate("MainContainer");
        }
      } else {
        throw new Error("Kakao login failed.");
      }
    } catch (err) {
      console.error("Kakao 로그인 에러:", err);
      Alert.alert("로그인 실패", "Kakao 로그인에 실패했습니다.");
    } finally {
      setKakaoLoading(false);
    }
  };  

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }} />
      <View style={{ flex: 2 }}>

        <View style={styles.logoArea}>
          <Text style={styles.logoText}>TuiTui</Text>
        </View>
        
        <View style={styles.btnArea}>
          <TouchableOpacity
            style={styles.btnKakao}
            onPress={handleKakaoLogin}
            disabled={kakaoLoading}
          >
            {kakaoLoading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Text style={{ color: "black", fontWeight: "bold", fontSize: 15 }}>
                카카오로 시작하기
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.btnArea}>
          <TouchableOpacity style={styles.btnNaver}>
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>
              네이버로 시작하기
            </Text>
          </TouchableOpacity>
        </View>

      </View>
      <View style={{ flex: 0.6 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#F9F9FD",
  },
  logoArea: {
    marginTop: hp(4),
    marginBottom: hp(5),
    justifyContent: "center",
    alignItems: "center",
  },
  btnArea: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(2),
  },
  logoText: {
    justifyContent: "center",
    alignItems: "center",
    fontSize: 80,
    letterSpacing: 20,
  },
  btnKakao: {
    width: wp(80),
    height: hp(7),
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FEE500",
  },
  btnNaver: {
    width: wp(80),
    height: hp(7),
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#03C75A",
  },
});

export default Loginscreen;
