import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { refreshToken } from '../../../../Components/refreshToken';

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  const [describeSelf, setDescribeSelf] = useState("");
  const [profileImgPath, setProfileImgPath] = useState(
    "https://d2ppx30y7ro2y1.cloudfront.net/profile_image/basic_profilie_image.png"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigation = useNavigation();
  const baseUrl = "https://tuituiworld.store:8443";

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userId = await AsyncStorage.getItem('userId');
      let accessToken = await AsyncStorage.getItem('accessToken');

      if (!userId || !accessToken) {
        console.log("userId 또는 accessToken이 없습니다.");
        return;
      }

      let response = await fetch(`${baseUrl}/api/users/${userId}/profiles`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      // Unauthorized 오류가 발생하면 새 토큰 발급 후 다시 실행
      if (response.status === 401) {
        accessToken = await refreshToken();
        response = await fetch(`${baseUrl}/api/users/${userId}/profiles`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
      }

      const responseBody = await response.json();

      if (response.ok) {

        const data = responseBody.data;
        setAccount(data.nickname || "닉네임 없음");
        setName(data.name || "이름 없음");
        setDescribeSelf(data.describeSelf || "자기소개 없음");

        const profileImgUrl = data.profileImgPath;
        if (profileImgUrl && profileImgUrl.trim() !== "") {
          fetch(profileImgUrl, { method: 'HEAD' })
            .then(response => {
              if (response.ok) {
                setProfileImgPath(profileImgUrl);
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
      setError('프로필 정보를 가져오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  useEffect(() => {
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
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {error && <Text style={styles.error}>{error}</Text>}
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
  error: {
    fontSize: 16,
    color: 'red',
    marginBottom: 16,
  },
});

export default ProfileScreen;
