import React, { useEffect, useState } from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login as kakaoLogin, getProfile as getKakaoProfile } from "@react-native-seoul/kakao-login";
import NaverLogin from '@react-native-seoul/naver-login';

// 네이버 로그인 설정
const consumerKey = 'czngT6MgRma04bBDCPEb';
const consumerSecret = 'lejSJUGn50';
const appName = 'TuiTui';
const serviceUrlSchemeIOS = 'com.suwonuniv.tuitui';

const base_url = "https://tuituiworld.store:8443";

function Loginscreen({ navigation }) {
  useEffect(() => {
    // 네이버 로그인 초기화
    NaverLogin.initialize({
      appName,
      consumerKey,
      consumerSecret,
      serviceUrlSchemeIOS: serviceUrlSchemeIOS,
      disableNaverAppAuthIOS: true,
    });
  }, []);
  
  const [kakaoLoading, setKakaoLoading] = useState(false);
  const [naverLoading, setNaverLoading] = useState(false);

  // 카카오 로그인 처리
  const handleKakaoLogin = async () => {
    setKakaoLoading(true);
    try {
      const result = await kakaoLogin();
      if (result) {
        const profile = await getKakaoProfile();
        await AsyncStorage.multiSet([
          ["account", profile.email || ""],
        ]);
        const email = encodeURIComponent(profile.email);
        const token = encodeURIComponent(result.accessToken);
        const apiUrl = `${base_url}/api/token?grant_type=authorization_code&account=${email}&sns_type=kakao&access_token=${token}`;
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const responseData = await response.json();
        if (response.status === 201) {
          // 새 계정이 생성된 경우
          const { accessToken, refreshToken } = responseData.data.token;
          await AsyncStorage.multiSet([
            ["accessToken", accessToken],
            ["refreshToken", refreshToken],
            ["userId", responseData.data.user.userId.toString()],
          ]);
          navigation.replace("ProfileCreate");
        } else if (response.status === 200) {
          // 이미 생성된 계정인 경우
          const { accessToken, refreshToken } = responseData.data.token;
          await AsyncStorage.multiSet([
            ["accessToken", accessToken],
            ["refreshToken", refreshToken],
            ["userId", responseData.data.user.userId.toString()],
          ]);
          navigation.replace("MainContainer");
        } else {
          Alert.alert("오류", `다른 기기에서 이미 로그인이 되어 있습니다.`);
        }
      } else {
        throw new Error("카카오 로그인 실패 (관리자에게 문의해주세요)");
      }
    } catch (err) {
      Alert.alert("오류", "카카오 로그인에 실패 (관리자에게 문의해주세요)");
    } finally {
      setKakaoLoading(false);
    }
  };

  // 네이버 로그인 처리
  const handleNaverLogin = async () => {
    setNaverLoading(true);
    try {
      const result = await NaverLogin.login();
      if (result.isSuccess) {
        const { accessToken, refreshToken } = result.successResponse;
        const profileResult = await NaverLogin.getProfile(accessToken);

        await AsyncStorage.multiSet([
          ["account", profileResult.response.email || ""],
        ]);

        const email = encodeURIComponent(profileResult.response.email);
        const token = encodeURIComponent(accessToken);
        const apiUrl = `${base_url}/api/token?grant_type=authorization_code&account=${email}&sns_type=naver&access_token=${token}`;

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const responseData = await response.json();

        if (response.status === 201) {
          // 새 계정이 생성된 경우
          const { accessToken, refreshToken } = responseData.data.token;
          await AsyncStorage.multiSet([
            ["accessToken", accessToken],
            ["refreshToken", refreshToken],
            ["userId", responseData.data.user.userId.toString()],
          ]);
          navigation.replace("ProfileCreate");
        } else if (response.status === 200) {
          // 이미 생성된 계정인 경우
          const { accessToken, refreshToken } = responseData.data.token;
          await AsyncStorage.multiSet([
            ["accessToken", accessToken],
            ["refreshToken", refreshToken],
            ["userId", responseData.data.user.userId.toString()],
          ]);
          navigation.replace("MainContainer");
        } else {
          Alert.alert("오류", `다른 기기에 이미 로그인이 되어 있습니다.`);
        }
      } else {
        throw new Error("네이버 로그인 실패 (관리자에게 문의해주세요)");
      }
    } catch (err) {
      Alert.alert("오류", "네이버 로그인에 실패 (관리자에게 문의해주세요)");
    } finally {
      setNaverLoading(false);
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
          <TouchableOpacity
            style={styles.btnNaver}
            onPress={handleNaverLogin}
            disabled={naverLoading}
          >
            {naverLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>
                네이버로 시작하기
              </Text>
            )}
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
