import React, { useState } from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login as kakaoLogin, getProfile as getKakaoProfile } from "@react-native-seoul/kakao-login";
import { refreshToken as getNewAccessToken } from "./refreshToken";

function Loginscreen({ navigation }) {
  const [kakaoLoading, setKakaoLoading] = useState(false);

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

        const base_url = "https://tuituiworld.store:8443";
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
            const newAccessToken = await getNewAccessToken(); // 토큰 재발급 요청
            console.log('재발급된 액세스 토큰:', newAccessToken);

            // 재발급된 토큰을 사용하여 필요한 작업을 수행합니다.
            navigation.navigate("MainContainer"); // 로그인 후 메인 화면으로 이동

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
