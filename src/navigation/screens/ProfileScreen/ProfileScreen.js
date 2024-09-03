import React, { useState, useCallback, useLayoutEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  const [describeSelf, setDescribeSelf] = useState("");
  const [profileImgPath, setProfileImgPath] = useState(
    "https://d2ppx30y7ro2y1.cloudfront.net/profile_image/basic_profilie_image.png"
  ); // 기본 프로필 URL
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  const navigation = useNavigation();
  const baseUrl = "https://tuituiworld.store:8443";

  const fetchProfile = useCallback(async () => {
    setLoading(true); // 로딩 시작

    try {
      const userId = await AsyncStorage.getItem('userId'); // AsyncStorage에서 userId 가져오기
      const accessToken = await AsyncStorage.getItem('accessToken');
      const storedProfileImg = await AsyncStorage.getItem('profileImage'); // 저장된 프로필 이미지 가져오기

      if (!userId || !accessToken) {
        console.log("userId 또는 token이 없습니다.");
        return;
      }

      // 저장된 프로필 이미지 URL이 있는 경우 설정
      if (storedProfileImg) {
        setProfileImgPath(storedProfileImg);
      }

      const response = await fetch(`${baseUrl}/api/users/${userId}/profiles`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const responseBody = await response.json();
      console.log('Response Body:', responseBody);

      if (response.ok) {
        const data = responseBody.data;

        setAccount(data.nickname || "닉네임 없음");
        setName(data.name || "이름 없음");
        setDescribeSelf(data.describeSelf || "자기소개 없음");

        const profileImgUrl = data.profileImgPath;
        if (profileImgUrl && profileImgUrl.trim() !== "") {
          // 이미지 경로 유효성 검사
          fetch(profileImgUrl, { method: 'HEAD' })
            .then(response => {
              if (response.ok) {
                setProfileImgPath(profileImgUrl);
                // AsyncStorage에 이미지 URL 저장
                AsyncStorage.setItem('profileImage', profileImgUrl);
              } else {
                setProfileImgPath(
                  "https://d2ppx30y7ro2y1.cloudfront.net/profile_image/basic_profilie_image.png"
                );
              }
            })
            .catch(() => {
              setProfileImgPath(
                "https://d2ppx30y7ro2y1.cloudfront.net/profile_image/basic_profilie_image.png"
              );
            });
        }
      } else {
        console.error("프로필 정보 가져오기 실패:", response.status);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false); // 로딩 끝
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  useLayoutEffect(() => {
    // 헤더 옵션 설정
    navigation.setOptions({
      headerLeft: () => (
        <View style={styles.headerLeft}>
          <Text style={styles.account}>{account || '닉네임 없음'}</Text>
        </View>
      ),
    });
  }, [navigation, account]);

  return (
    <View style={styles.container}>
      {loading ? ( // 로딩 중 표시
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <View style={styles.profileHeader}>
            <Image style={styles.img} source={{ uri: profileImgPath }} />
            <View style={styles.stats}>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>게시글</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>팔로워</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>팔로잉</Text>
              </View>
            </View>
          </View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.describeSelf}>{describeSelf}</Text>
          <View style={styles.posts}></View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  img: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    marginLeft: 8,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  stat: {
    alignItems: 'center',
    marginHorizontal: 24,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  account: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  describeSelf: {
    fontSize: 16,
    marginBottom: 16,
  },
  posts: {
    flexDirection: 'row',
  },
  headerLeft: {
    marginLeft: 16,
  },
});

export default ProfileScreen;
