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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getUserProfile = async (userId) => {
  const response = await fetch(
    `http://13.124.69.147:8080/api/users/${userId}/profiles`
  );
  const data = await response.json();
  console.log("Profile data:", data); // 서버에서 받은 응답 데이터 로그 출력 (확인용임 지워도됨)
  return data;
};

function Loginscreen({ navigation }) {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const apiURL = "http://13.124.69.147:8080/api/login"; // 서버의 로그인 API URL

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

      if (!response.ok) {
        throw new Error("서버 오류");
      }

      const data = await response.json();
      console.log("User data:", data); // 서버에서 받은 응답 데이터 로그 출력(확인용임 지워도됨)

      if (data.message === "로그인 성공") {
        const user = data.data;

        if (user && user.userId) {
          // 프로필 API 호출하여 닉네임 가져오기
          const profileResponse = await getUserProfile(user.userId);
          const profile = profileResponse.data;

          // 기존 데이터 삭제 - 로그아웃하고 다른 계정 로그인할때 사용
          await AsyncStorage.removeItem("user_id");
          await AsyncStorage.removeItem("name");
          await AsyncStorage.removeItem("nickname");
          await AsyncStorage.removeItem("profileImgPath");
          await AsyncStorage.removeItem("describeSelf");
          await AsyncStorage.removeItem("profileId");

          // 새로운 데이터 저장
          await AsyncStorage.setItem("user_id", user.userId.toString()); // userId를 문자열로 저장
          await AsyncStorage.setItem("name", user.name || "");
          await AsyncStorage.setItem("nickname", profile.nickname || ""); // 닉네임 저장
          await AsyncStorage.setItem(
            "profileImgPath",
            profile.profileImgPath || ""
          ); // 프로필 이미지 저장
          await AsyncStorage.setItem(
            "describeSelf",
            profile.describeSelf || ""
          ); // 자기소개 저장
          await AsyncStorage.setItem(
            "profileId",
            profile.profileId.toString() || ""
          );

          navigation.navigate("MainContainer");
        } else {
          Alert.alert("오류", "유저 정보를 저장할 수 없습니다.");
        }
      } else {
        Alert.alert("로그인 실패", "아이디 또는 비밀번호가 틀렸습니다");
      }
    } catch (error) {
      Alert.alert("오류", error.message);
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
          <TouchableOpacity style={styles.btnBlue} onPress={handleLogin}>
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>
              로그인
            </Text>
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
          <TouchableOpacity style={styles.btnKakao}>
            <Text style={{ color: "black", fontWeight: "bold", fontSize: 15 }}>
              카카오로 시작하기
            </Text>
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
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: 30,
    marginBottom: hp(1),
    paddingHorizontal: wp(3),
  },
});

export default Loginscreen;
