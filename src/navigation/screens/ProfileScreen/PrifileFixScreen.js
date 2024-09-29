import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';

// 프로필 정보를 서버에 저장하는 함수 (닉네임과 자기소개만 전송)
const saveUserProfile = async (profileId, nickname, describeSelf, accessToken) => {
  try {
    const response = await fetch(`https://tuituiworld.store:8443/api/profiles`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ profileId, nickname, describeSelf }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`프로필 저장에 실패했습니다. 서버 응답: ${errorData}`);
    }
  } catch (error) {
    throw new Error(`프로필 저장에 실패했습니다. 오류: ${error.message}`);
  }
};

// 프로필 이미지를 서버에 업로드하는 함수
const uploadProfileImage = async (accessToken, imageUri) => {
  const storedProfileId = await AsyncStorage.getItem('profileId');
  const profileId = storedProfileId ? JSON.parse(storedProfileId) : null;

  if (!profileId) {
    throw new Error("프로필 ID가 없습니다.");
  }

  const formData = new FormData();

  formData.append("profileId", profileId);
  formData.append("file", {
    uri: imageUri,
    type: 'image/jpeg', // 이미지 파일의 MIME 타입
    name: 'profile.jpg', // 업로드될 파일 이름
  });

  try {
    const response = await fetch("https://tuituiworld.store:8443/api/profiles/images", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`이미지 업로드에 실패했습니다. 서버 응답: ${errorData}`);
    }

    return response;
  } catch (error) {
    throw new Error(`이미지 업로드 중 오류가 발생했습니다: ${error.message}`);
  }
};

const ProfileFixScreen = ({ navigation }) => {
  const [realName, setRealName] = useState("");
  const [nickname, setNickname] = useState("");
  const [describeSelf, setDescribeSelf] = useState("");
  const [profileImgPath, setProfileImgPath] = useState(
    "https://d2ppx30y7ro2y1.cloudfront.net/profile_image/basic_profilie_image.png"
  ); // 기본 프로필 URL
  const [isImageChanged, setIsImageChanged] = useState(false); // 이미지 변경 상태 추가

  // 프로필 정보 가져오기
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedName = await AsyncStorage.getItem('name');
        const storedNickname = await AsyncStorage.getItem('nickname');
        const storedDescribeSelf = await AsyncStorage.getItem('describeSelf');
        const storedProfileImgPath = await AsyncStorage.getItem('profileImgPath');

        if (storedName) setRealName(storedName);
        if (storedNickname) setNickname(storedNickname);
        if (storedDescribeSelf) setDescribeSelf(storedDescribeSelf);
        if (storedProfileImgPath) setProfileImgPath(storedProfileImgPath);

      } catch (error) {
        console.log('프로필 정보 불러오기 오류:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const profileId = await AsyncStorage.getItem('profileId');
      if (!accessToken || !profileId) {
        Alert.alert("오류", "액세스 토큰 또는 프로필 ID가 없습니다. 로그인 상태를 확인하세요.");
        return;
      }
  
      // 이미지가 변경되었는지 확인
      if (profileImgPath && profileImgPath !== "https://d2ppx30y7ro2y1.cloudfront.net/profile_image/basic_profilie_image.png") {
        const uploadResponse = await uploadProfileImage(accessToken, profileImgPath);
      }
  
      // 닉네임이나 자기소개 저장
      await saveUserProfile(profileId, nickname, describeSelf, accessToken);
  
      // 저장된 정보 AsyncStorage에 저장
      await AsyncStorage.setItem('nickname', nickname);
      await AsyncStorage.setItem('describeSelf', describeSelf);
      
      Alert.alert("성공", "프로필이 저장되었습니다.");
      navigation.goBack(); // 이전 화면으로 이동
    } catch (error) {
      console.error("프로필 저장 오류:", error);
      Alert.alert("오류", error.message);
    }
  };  
  
  const handleImagePicker = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, (response) => {
      if (response.didCancel) {
      } else if (response.errorCode) {
        console.error("이미지 선택 오류:", response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setProfileImgPath(response.assets[0].uri); // 선택한 이미지 경로를 상태에 저장
        setIsImageChanged(true); // 이미지 변경 상태
      }
    });
  };  

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSaveProfile}>
          <Text style={styles.headerButtonText}>완료</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, nickname, describeSelf, profileImgPath]);

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Image style={styles.img} source={{ uri: profileImgPath }} />
        <TouchableOpacity onPress={handleImagePicker}>
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
        <Text style={styles.label}>자기소개</Text>
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
