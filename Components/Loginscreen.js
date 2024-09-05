import React, { useEffect, useState } from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login as kakaoLogin, getProfile as getKakaoProfile } from "@react-native-seoul/kakao-login";
import { refreshToken as getNewAccessToken } from "./refreshToken";
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
          ["name", profile.name || ""],
          ["phone", profile.phoneNumber || ""],
          ["account", profile.email || ""],
          ["birthyear", profile.birthyear || ""],
          ["birthday", profile.birthday || ""],
          ["gender", profile.gender || ""],
          ["profileImgPath", profile.profileImageUrl || ""],
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
        if (response.ok) {
          const { accessToken, refreshToken } = responseData.data.token;
          await AsyncStorage.multiSet([
            ["accessToken", accessToken],
            ["refreshToken", refreshToken],
            ["userId", responseData.data.user.userId.toString()],
          ]);
          navigation.navigate("ProfileCreate");
        } else if (responseData.code === "USER-006") {
          console.warn("이미 생성된 계정입니다. 토큰 재발급을 시도합니다.");
          try {
            const newAccessToken = await getNewAccessToken();
            console.log('재발급된 액세스 토큰:', newAccessToken);
            navigation.navigate("MainContainer");
          } catch (error) {
            console.error("토큰 재발급 실패:", error);
            Alert.alert("로그인 실패", "토큰 재발급에 실패했습니다.");
          }
        } else {
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

  // 네이버 로그인 처리
  const handleNaverLogin = async () => {
    setNaverLoading(true);
    try {
        const result = await NaverLogin.login();

        console.log("Naver Login Result:", result);

        if (result.isSuccess) {
            const { accessToken, refreshToken } = result.successResponse;
            console.log("Access Token:", accessToken);
            console.log("Refresh Token:", refreshToken);

            // 네이버 프로필 정보 가져오기
            const profileResult = await NaverLogin.getProfile(accessToken);
            console.log("Naver Profile:", profileResult);

            await AsyncStorage.multiSet([
              ["name", profileResult.response.name || ""],
              ["phone", profileResult.response.mobile || ""],
              ["account", profileResult.response.email || ""],
              ["birthyear", profileResult.response.birthyear || ""],
              ["birthday", profileResult.response.birthday || ""],
              ["gender", profileResult.response.gender || ""],
              ["profileImgPath", profileResult.response.profile_image || ""],
            ]);

            // 이메일과 토큰 인코딩
            const email = encodeURIComponent(profileResult.response.email);
            const token = encodeURIComponent(accessToken);
            const apiUrl = `${base_url}/api/token?grant_type=authorization_code&account=${email}&sns_type=naver&access_token=${token}`;
            console.log("apiUrl:", apiUrl);

            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // 응답 상태와 본문을 콘솔에 출력합니다.
            console.log("Response Status:", response.status);

            const responseData = await response.json();
            
            console.log("Response Body:", responseData);

            if (response.ok) {
                const { accessToken, refreshToken } = responseData.data.token;
                await AsyncStorage.multiSet([
                    ["accessToken", accessToken],
                    ["refreshToken", refreshToken],
                    ["userId", responseData.data.user.userId.toString()],
                ]);
                navigation.navigate("ProfileCreate");
            } else if (responseData.code === "USER-006") {
                console.warn("이미 생성된 계정입니다. 토큰 재발급을 시도합니다.");
                try {
                    const newAccessToken = await getNewAccessToken();
                    console.log('재발급된 액세스 토큰:', newAccessToken);
                    navigation.navigate("MainContainer");
                } catch (error) {
                    console.error("토큰 재발급 실패:", error);
                    Alert.alert("로그인 실패", "토큰 재발급에 실패했습니다.");
                }
            } else {
                console.error("서버 응답:", responseData);
                navigation.navigate("MainContainer");
            }
        } else {
            throw new Error("Naver login failed.");
        }
    } catch (err) {
        console.error("Naver 로그인 에러:", err);
        Alert.alert("로그인 실패", "Naver 로그인에 실패했습니다.");
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
