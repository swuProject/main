import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchImageLibrary } from "react-native-image-picker";

function ProfileCreateScreen({ navigation }) {
  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [gender, setGender] = useState("");
  const [profileImgPath, setProfileImgPath] = useState("");
  const [nickname, setNickname] = useState("");
  const [describeSelf, setdescribeSelf] = useState("");

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const storedAccount = await AsyncStorage.getItem("account");
        setAccount(storedAccount);
      } catch (error) {
        console.error("이메일을 불러오는데 실패했습니다.", error);
      }
    };
    loadProfileData();
  }, []);

  const handleImagePicker = () => {
    launchImageLibrary({ mediaType: "photo", quality: 0.5 }, (response) => {
      if (response.didCancel) {
        console.log("사용자가 이미지 선택을 취소했습니다.");
      } else if (response.errorCode) {
        console.error("이미지 선택 오류:", response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setProfileImgPath(response.assets[0].uri);
      }
    });
  };

  const handleSubmit = async () => {
    const birth = `${birthYear}-${birthMonth}-${birthDay}`; // 생년월일을 YYYY-MM-DD 형식으로 결합
    if (!name || !birth || !nickname || !gender) {
      Alert.alert("오류", "입력란을 모두 채워주세요.");
      return;
    }

    try {
      let accessToken = await AsyncStorage.getItem("accessToken");
      const userId = await AsyncStorage.getItem("userId");

      if (!userId) {
        Alert.alert("오류", "로그인이 필요합니다.");
        navigation.replace("Login");
        return;
      }

      const profileData = {
        userId,
        name,
        nickname,
        describeSelf,
        gender,
        birth,
      };

      let response;

      // 프로필 이미지가 있는 경우
      if (profileImgPath) {
        const formData = new FormData();
        formData.append("request", JSON.stringify(profileData));

        formData.append("file", {
          uri: profileImgPath,
          type: "image/jpeg",
          name: "profile.jpg",
        });

        response = await fetchProfileWithImage(accessToken, formData);
      } else {
        response = await fetchProfileWithoutImage(accessToken, profileData);
      }

      // 토큰 만료 시 갱신 처리
      if (response.status === 401) {
        const newAccessToken = await refreshToken();
        if (newAccessToken) {
          await AsyncStorage.setItem("accessToken", newAccessToken);
          accessToken = newAccessToken;
          response = await fetchProfileWithImage(accessToken, formData);
        } else {
          Alert.alert("오류", "액세스 토큰 갱신에 실패했습니다.");
          return;
        }
      }

      const responseData = await response.json();
      console.log(responseData.message);

      if (response.ok) {
        // profileId 저장
        const profileId = responseData.data.profileId;
        await AsyncStorage.setItem("profileId", profileId.toString());

        Alert.alert("성공", "프로필이 성공적으로 생성되었습니다.");
        navigation.replace("MainContainer");
      } else {
        Alert.alert(
          "오류",
          responseData.data.name ||
            responseData.data.nickname ||
            "알 수 없는 오류"
        );
      }
    } catch (error) {
      console.error("오류", error);
    }
  };

  const fetchProfileWithImage = async (accessToken, formData) => {
    return fetch("https://tuituiworld.store/api/profiles/with-image", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });
  };

  const fetchProfileWithoutImage = async (accessToken, profileData) => {
    return fetch("https://tuituiworld.store/api/profiles/without-image", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });
  };

  // 성별 선택 버튼
  const renderGenderButton = () => {
    return (
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[
            styles.genderButton,
            gender === "MALE" && styles.genderButtonSelected,
          ]}
          onPress={() => setGender("MALE")}
        >
          <Text style={styles.genderButtonText}>남성</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.genderButton,
            gender === "FEMALE" && styles.genderButtonSelected,
          ]}
          onPress={() => setGender("FEMALE")}
        >
          <Text style={styles.genderButtonText}>여성</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={handleImagePicker}>
        {profileImgPath ? (
          <Image source={{ uri: profileImgPath }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderImage} />
        )}
      </TouchableOpacity>

      <View style={styles.infoGroup}>
        <Text style={styles.label}>이메일</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>{account}</Text>
        </View>
      </View>

      <View style={styles.infoGroup}>
        <Text style={styles.label}>이름</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.inputText}
            value={name}
            placeholder="이름을 입력해 주세요."
            onChangeText={setName}
          />
        </View>
      </View>

      <View style={styles.infoGroup}>
        <Text style={styles.label}>생년월일</Text>
        <View style={styles.birthContainer}>
          <TextInput
            style={styles.birthInput}
            value={birthYear}
            placeholder="YYYY"
            maxLength={4}
            keyboardType="numeric"
            onChangeText={setBirthYear}
          />
          <TextInput
            style={styles.birthInput}
            value={birthMonth}
            placeholder="MM"
            maxLength={2}
            keyboardType="numeric"
            onChangeText={setBirthMonth}
          />
          <TextInput
            style={styles.birthInput}
            value={birthDay}
            placeholder="DD"
            maxLength={2}
            keyboardType="numeric"
            onChangeText={setBirthDay}
          />
        </View>
      </View>

      <View style={styles.infoGroup}>
        <Text style={styles.label}>성별</Text>
        {renderGenderButton(gender)}
      </View>

      <View style={styles.infoGroup}>
        <Text style={styles.label}>닉네임</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.inputText}
            value={nickname}
            placeholder="영문과 숫자 2~15자 범위 내에서 입력해 주세요."
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
    fontSize: 18,
    color: "#fff",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ccc",
    marginBottom: 20,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  genderButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  genderButtonSelected: {
    backgroundColor: "#4F8BFF",
    borderColor: "#4F8BFF",
  },
  genderButtonText: {
    fontSize: 16,
    color: "#333",
  },
  birthContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  birthInput: {
    flex: 1,
    marginHorizontal: 5,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
});

export default ProfileCreateScreen;
