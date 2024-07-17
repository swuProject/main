import { View, Text, Image, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const [describeSelf, setDescribeSelf] = useState("");
  const [profileImgPath, setProfileImgPath] = useState("https://d2ppx30y7ro2y1.cloudfront.net/profile_image/basic_profilie_image.png"); // 기본 프로필 URL

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedDescribeSelf = await AsyncStorage.getItem('describeSelf');
        const storedProfileImgPath = await AsyncStorage.getItem('profileImgPath');

        if (storedDescribeSelf) {
          setDescribeSelf(storedDescribeSelf);
        }
        // URL이 비었는지 확인
        if (storedProfileImgPath && storedProfileImgPath.trim() !== '') {
          // 가능한 URL인지 확인
          fetch(storedProfileImgPath, { method: 'HEAD' })
            .then(response => {
              if (response.ok) {
                setProfileImgPath(storedProfileImgPath);
              }
            })
            .catch(() => {
              // URL이 없거나 불가능하면 기본 이미지
              setProfileImgPath("https://d2ppx30y7ro2y1.cloudfront.net/profile_image/basic_profilie_image.png");
            });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        style={styles.img}
        source={{ uri: profileImgPath }}
      />
      <Text style={styles.describe}>{describeSelf}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column', // 세로 방향 배치
    alignItems: 'flex-start', // 왼쪽 정렬
    marginLeft: 16, // 왼쪽 여백
    marginTop: 16, // 위쪽 여백
  },
  img: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16, // 프로필 이미지와 설명 사이의 간격
  },
  describe: {
    fontSize: 18,
    color: 'black',
  },
});

export default ProfileScreen;
