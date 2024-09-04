import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { refreshToken } from "./refreshToken";

function ProfileCreateScreen({ navigation }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [account, setAccount] = useState("");
  const [birthyear, setBirthyear] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [profileImgPath, setProfileImgPath] = useState("");
  const [nickname, setNickname] = useState("");
  const [describeSelf, setdescribeSelf] = useState("");

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const storedName = await AsyncStorage.getItem("name");
        const storedPhone = await AsyncStorage.getItem("phone");
        const storedAccount = await AsyncStorage.getItem("account");
        const storedBirthyear = await AsyncStorage.getItem("birthyear");
        const storedBirthday = await AsyncStorage.getItem("birthday");
        const storedGender = await AsyncStorage.getItem("gender");
        const storedProfileImgPath = await AsyncStorage.getItem("profileImgPath");
        const storedNickname = await AsyncStorage.getItem("nickname");
        const storedDescribeSelf = await AsyncStorage.getItem("describeSelf");

        setName(storedName || "");
        setPhone(storedPhone || "");
        setAccount(storedAccount || "");
        setBirthyear(storedBirthyear || "");
        setBirthday(storedBirthday || "");
        setGender(storedGender === "male" ? "MALE" : storedGender === "female" ? "FEMALE" : "");
        setProfileImgPath(storedProfileImgPath || "");
        setNickname(storedNickname || "");
        setdescribeSelf(storedDescribeSelf || "");
      } catch (error) {
        console.error("프로필 데이터를 불러오는 데 실패했습니다.", error);
      }
    };

    loadProfileData();
  }, []);

  const handleSubmit = async () => {
    if (!nickname || !describeSelf) {
      Alert.alert("오류", "입력란을 모두 채워주세요.");
      return;
    }

    try {
      let accessToken = await AsyncStorage.getItem("accessToken");
      const userId = await AsyncStorage.getItem("userId");

      if (!userId) {
        Alert.alert("오류", "로그인이 필요합니다.");
        navigation.navigate("Login");
        return;
      }

      // nickname과 describeSelf를 AsyncStorage에 저장
      await AsyncStorage.setItem("nickname", nickname);
      await AsyncStorage.setItem("describeSelf", describeSelf);

      // 프로필 데이터 정의
      const profileData = {
        userId,
        name,
        phone,
        nickname,
        describeSelf,
        gender,
        birthDate: formatDate(),
      };

      // 액세스 토큰 만료 확인 및 갱신
      let response = await fetch("https://tuituiworld.store:8443/api/profiles/without-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify(profileData),
      });

      if (response.status === 401) { // Unauthorized
        const newAccessToken = await refreshToken();
        if (newAccessToken) {
          await AsyncStorage.setItem("accessToken", newAccessToken); // 갱신된 액세스 토큰 저장
          accessToken = newAccessToken;
          // 갱신된 액세스 토큰으로 다시 시도
          response = await fetch("https://tuituiworld.store:8443/api/profiles/without-image", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify(profileData),
          });
        } else {
          Alert.alert("오류", "액세스 토큰 갱신에 실패했습니다.");
          return;
        }
      }

      if (response.ok) {
        Alert.alert("성공", "프로필이 성공적으로 생성되었습니다.");
        navigation.navigate("MainContainer");
      } else {
        const errorResponse = await response.json();
        console.error("프로필 생성 실패:", errorResponse);
        Alert.alert("오류", errorResponse.message);
      }
    } catch (error) {
      console.error("오류", error);
      Alert.alert("오류", "프로필 생성 중 오류가 발생했습니다.");
    }
  };

  const formatDate = () => {
    if (birthyear && birthday.length === 4) {
      const month = birthday.slice(0, 2);
      const day = birthday.slice(2, 4);
      return `${birthyear}-${month}-${day}`;
    }
    return "";
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {profileImgPath ? (
        <Image source={{ uri: profileImgPath }} style={styles.profileImage} />
      ) : (
        <View style={styles.placeholderImage} />
      )}

      <View style={styles.infoGroup}>
        <Text style={styles.label}>이름</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>{name}</Text>
        </View>
      </View>

      <View style={styles.infoGroup}>
        <Text style={styles.label}>전화번호</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>{phone}</Text>
        </View>
      </View>

      <View style={styles.infoGroup}>
        <Text style={styles.label}>이메일</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>{account}</Text>
        </View>
      </View>

      <View style={styles.infoGroup}>
        <Text style={styles.label}>생년월일</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>{formatDate()}</Text>
        </View>
      </View>

      <View style={styles.infoGroup}>
        <Text style={styles.label}>성별</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>{gender}</Text>
        </View>
      </View>

      <View style={styles.infoGroup}>
        <Text style={styles.label}>닉네임</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.inputText}
            value={nickname}
            placeholder="2자 이상 20자 이하로 입력해 주세요."
            onChangeText={setNickname}
          />
        </View>
      </View>

      <View style={styles.infoGroup}>
        <Text style={styles.label}>자기소개</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={[styles.inputText, styles.describeSelfInput]}
            value={describeSelf}
            placeholder="자신을 간단하게 소개해 보세요."
            onChangeText={setdescribeSelf}
            multiline={true}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>생성하기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#F9F9FD",
    alignItems: "center",
  },
  infoGroup: {
    width: "100%",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  infoBox: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  infoText: {
    fontSize: 16,
    color: "#333",
  },
  inputBox: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 12,
  },
  inputText: {
    fontSize: 16,
    color: "#333",
  },
  describeSelfInput: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    width: "100%",
    backgroundColor: "#4F8BFF",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 20,
    marginBottom: 10,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ccc",
    marginBottom: 20,
  },
});

export default ProfileCreateScreen;
