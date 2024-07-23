import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 닉네임을 기준으로 사용자 프로필을 불러오는 함수
const getUserProfileByNickname = async (nickname) => {
  const response = await fetch(`http://13.124.69.147:8080/api/profiles/nicknames/${nickname}`);
  if (!response.ok) {
    const errorData = await response.text(); // 서버에서 반환된 에러 메시지를 받아옴
    throw new Error(`프로필 정보를 불러올 수 없습니다. 서버 응답: ${errorData}`);
  }
  const data = await response.json();
  return data;
};

// 프로필 정보를 서버에 저장하는 함수
const saveUserProfile = async (nickname, describeSelf) => {
  const response = await fetch(`http://13.124.69.147:8080/api/profiles/nicknames/${nickname}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nickname,
      describeSelf,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text(); // 서버에서 반환된 에러 메시지를 받아옴
    throw new Error(`프로필 저장에 실패했습니다. 서버 응답: ${errorData}`);
  }
};

const ProfileFixScreen = ({ navigation }) => {
  const [realName, setRealName] = useState("");
  const [nickname, setNickname] = useState("");
  const [describeSelf, setDescribeSelf] = useState("");
  const [profileImgPath, setProfileImgPath] = useState("https://d2ppx30y7ro2y1.cloudfront.net/profile_image/basic_profilie_image.png"); // 기본 프로필 URL

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedNickname = await AsyncStorage.getItem('nickname');
        if (!storedNickname) {
          Alert.alert('오류', '로그인 정보가 없습니다.');
          return;
        }

        const storedRealName = await AsyncStorage.getItem('realName');
        const storedDescribeSelf = await AsyncStorage.getItem('describeSelf');
        const storedProfileImgPath = await AsyncStorage.getItem('profileImgPath');

        if (storedRealName) setRealName(storedRealName);
        if (storedNickname) setNickname(storedNickname);
        if (storedDescribeSelf) setDescribeSelf(storedDescribeSelf);
        if (storedProfileImgPath) setProfileImgPath(storedProfileImgPath);

        // 서버에서 최신 정보를 가져옴
        const profileResponse = await getUserProfileByNickname(storedNickname);
        const profile = profileResponse.data;
        if (profile.realName) setRealName(profile.realName);
        if (profile.nickname) setNickname(profile.nickname);
        if (profile.describeSelf) setDescribeSelf(profile.describeSelf);
        if (profile.profileImgPath && profile.profileImgPath.trim() !== '') {
          fetch(profile.profileImgPath, { method: 'HEAD' })
            .then(response => {
              if (response.ok) {
                setProfileImgPath(profile.profileImgPath);
              }
            })
            .catch(() => {
              setProfileImgPath("https://d2ppx30y7ro2y1.cloudfront.net/profile_image/basic_profilie_image.png");
            });
        }
      } catch (error) {
        console.error('프로필 불러오기 오류:', error.message);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      await saveUserProfile(nickname, describeSelf);
      await AsyncStorage.setItem('realName', realName);
      await AsyncStorage.setItem('nickname', nickname);
      await AsyncStorage.setItem('describeSelf', describeSelf);
      await AsyncStorage.setItem('profileImgPath', profileImgPath);
      Alert.alert('성공', '프로필이 저장되었습니다.');
    } catch (error) {
      Alert.alert('오류', error.message);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.headerButtonText}>완료</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleSave]);

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Image
          style={styles.img}
          source={{ uri: profileImgPath }}
        />
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
          onChangeText={setNickname}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.textBox}>
        <Text style={styles.label}>설명</Text>
        <TextInput
          style={styles.input}
          value={describeSelf}
          onChangeText={setDescribeSelf}
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
    backgroundColor: '#fff', // 배경색을 흰색으로 설정
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30, // 프로필 섹션과 입력 박스 사이의 간격을 넓히기 위한 마진
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 50, // 이미지가 원형으로 표시되도록 설정
  },
  changeButton: {
    marginTop: 10,
    fontSize: 16,
    color: "#03C75A",
  },
  textBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30, // 각 입력 박스 사이의 간격을 넓히기 위한 마진
  },
  label: {
    fontSize: 18,
    marginRight: 20,
    fontWeight: 'bold', // 레이블 텍스트를 굵게 표시
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontSize: 18,
    paddingVertical: 5,
  },
  headerButtonText: {
    color: "#03C75A", // 버튼 텍스트 색상
    fontSize: 18,
    marginRight: 10,
    fontWeight: 'bold', // 버튼 텍스트를 굵게 표시
  },
  font: {
    fontSize: 18,
  },
});

export default ProfileFixScreen;
