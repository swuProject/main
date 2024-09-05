import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 프로필 정보를 서버에 저장하는 함수 (닉네임과 자기소개만 전송)
const saveUserProfile = async (userId, nickname, describeSelf, accessToken) => {
  try {
    const response = await fetch(`https://tuituiworld.store:8443/api/profiles`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ userId, nickname, describeSelf }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`프로필 저장에 실패했습니다. 서버 응답: ${errorData}`);
    }
  } catch (error) {
    throw new Error(`프로필 저장에 실패했습니다. 오류: ${error.message}`);
  }
};

const ProfileFixScreen = ({ navigation }) => {
  const [userId, setUserId] = useState("");
  const [realName, setRealName] = useState("");
  const [nickname, setNickname] = useState("");
  const [describeSelf, setDescribeSelf] = useState("");
  const [profileImgPath, setProfileImgPath] = useState(
    "https://d2ppx30y7ro2y1.cloudfront.net/profile_image/basic_profilie_image.png"
  ); // 기본 프로필 URL

  // 프로필 정보 가져오기
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedName = await AsyncStorage.getItem('name');
        const storedNickname = await AsyncStorage.getItem('nickname');
        const storedDescribeSelf = await AsyncStorage.getItem('describeSelf');
        const storedProfileImgPath = await AsyncStorage.getItem('profileImage');

        // 상태 업데이트
        if (storedUserId) setUserId(storedUserId);
        if (storedName) setRealName(storedName);
        if (storedNickname) setNickname(storedNickname);
        if (storedDescribeSelf) setDescribeSelf(storedDescribeSelf);
        if (storedProfileImgPath) setProfileImgPath(storedProfileImgPath);
      } catch (error) {
        console.log('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      // 엑세스 토큰이 있는지 확인
      if (!accessToken) {
        Alert.alert("오류", "액세스 토큰이 없습니다. 로그인 상태를 확인하세요.");
        return;
      }
      // 유저 ID가 있는지 확인
      if (userId === null) {
        Alert.alert("오류", "유저 ID를 찾을 수 없습니다.");
        return;
      }
  
      await saveUserProfile(userId, nickname, describeSelf, accessToken);
      await AsyncStorage.setItem('nickname', nickname);
      await AsyncStorage.setItem('describeSelf', describeSelf);
      Alert.alert("성공", "프로필이 저장되었습니다.");
      navigation.goBack(); // 이전 화면으로 이동
    } catch (error) {
      Alert.alert("오류", error.message);
    }
  };

  // 네비게이션 옵션 설정
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSaveProfile}>
          <Text style={styles.headerButtonText}>완료</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, nickname, describeSelf]); // 닉네임과 설명이 변경되면 반영

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Image style={styles.img} source={{ uri: profileImgPath }} />
        <TouchableOpacity>
          <Text style={styles.changeButton}>사진 변경</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.textBox}>
        <Text style={styles.label}>이름</Text>
        <Text style={styles.font}>{realName}</Text>
      </View>
      <View style={styles.textBox}>
        <Text style={styles.label}>닉네임</Text>
        <TextInput
          style={styles.input}
          value={nickname}
          onChangeText={setNickname} // 유저 입력값을 상태로 업데이트
          autoCapitalize="none"
        />
      </View>
      <View style={styles.textBox}>
        <Text style={styles.label}>설명</Text>
        <TextInput
          style={styles.input}
          value={describeSelf}
          onChangeText={setDescribeSelf} // 유저 입력값을 상태로 업데이트
          autoCapitalize="none"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  changeButton: {
    marginTop: 10,
    fontSize: 16,
    color: "#4F8BFF",
  },
  textBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    marginRight: 20,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontSize: 18,
    paddingVertical: 5,
  },
  headerButtonText: {
    color: "#4F8BFF",
    fontSize: 18,
    marginRight: 10,
    fontWeight: 'bold',
  },
  font: {
    fontSize: 18,
  },
});

export default ProfileFixScreen;
