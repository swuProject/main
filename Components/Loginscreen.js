import React, { useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login as kakaoLogin, getProfile as getKakaoProfile } from "@react-native-seoul/kakao-login";

// 서버에서 사용자 프로필 가져오기
const getUserProfile = async (userId) => {
  try {
    const response = await fetch(
      `http://13.124.69.147:8080/api/users/${userId}/profiles`
    );
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const data = await response.json();
    console.log("Profile data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

function Loginscreen({ navigation }) {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [kakaoLoading, setKakaoLoading] = useState(false);

  // 일반 로그인 처리
  const handleLogin = async () => {
    const apiURL = "http://13.124.69.147:8080/api/login";

    if (!account || !password) {
      Alert.alert("입력 오류", "이메일과 비밀번호를 입력해 주세요.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account,
          password,
        }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        Alert.alert(data.message);
      }

      console.log("User data:", data);

      if (data.status === "OK") {
        const user = data.data;

        if (user && user.userId) {
          const profileResponse = await getUserProfile(user.userId);
          const profile = profileResponse.data;

          await AsyncStorage.clear();
          await AsyncStorage.setItem("user_id", user.userId.toString());
          await AsyncStorage.setItem("name", user.name || "");
          await AsyncStorage.setItem("nickname", profile.nickname || "");
          await AsyncStorage.setItem("profileImgPath", profile.profileImgPath || "");
          await AsyncStorage.setItem("describeSelf", profile.describeSelf || "");
          await AsyncStorage.setItem("profileId", profile.profileId.toString() || "");

          navigation.navigate("MainContainer");
        } else {
          Alert.alert("오류", "유저 정보를 저장할 수 없습니다.");
        }
      }
    } catch (error) {
      Alert.alert("오류", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Kakao 로그인 처리
  const handleKakaoLogin = async () => {
    setKakaoLoading(true);

    try {
      // 카카오 로그인 요청
      const result = await kakaoLogin();
      if (result) {
        console.log("Kakao token:", result);

        // 카카오 프로필 정보 요청
        const profile = await getKakaoProfile();
        console.log("Kakao profile:", profile);

        // 프로필 정보를 AsyncStorage에 저장
        await AsyncStorage.setItem("kakao_id", profile.id.toString());
        await AsyncStorage.setItem("name", profile.name || "");
        await AsyncStorage.setItem("nickname", profile.nickname || "");
        await AsyncStorage.setItem("profileImgPath", profile.profileImageUrl || "");

        // MainContainer로 이동
        navigation.navigate("MainContainer");
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
        <View style={styles.inputArea}>
          <TextInput
            placeholder="E-mail"
            style={styles.inputBox}
            value={account}
            onChangeText={setAccount}
            autoCapitalize="none"
            
          />
          <TextInput
            placeholder="Password"
            style={styles.inputBox}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            secureTextEntry
          />
        </View>
        <View style={styles.btnArea}>
          <TouchableOpacity
            style={styles.btnBlue}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>
                로그인
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.registerArea}>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text
              style={{
                color: "#5B93FF",
                fontWeight: "bold",
                marginBottom: hp(1),
              }}
            >
              회원가입
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={{ color: "#5B93FF", fontWeight: "bold" }}>
              아이디/비밀번호 찾기
            </Text>
          </TouchableOpacity>
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
    backgroundColor: "white",
  },
  logoArea: {
    marginTop: hp(-10),
    marginBottom: hp(5),
    justifyContent: "center",
    alignItems: "center",
  },
  inputArea: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(2),
  },
  btnArea: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(1),
  },
  registerArea: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(3),
    marginBottom: hp(6),
  },
  logoText: {
    justifyContent: "center",
    alignItems: "center",
    fontSize: 80,
    letterSpacing: 20,
  },
  btnBlue: {
    width: wp(80),
    height: hp(6),
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4F8BFF",
  },
  btnKakao: {
    width: wp(80),
    height: hp(6),
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FEE500",
  },
  btnNaver: {
    width: wp(80),
    height: hp(6),
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#03C75A",
  },
  inputBox: {
    width: wp(80),
    height: hp(6),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
});

export default Loginscreen;
