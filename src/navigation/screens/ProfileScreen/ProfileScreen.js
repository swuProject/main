import React, { useState, useCallback, useLayoutEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { refreshToken } from '../../../../Components/refreshToken';

const base_url = "https://tuituiworld.store:8443";
const defaultImg = "https://d2ppx30y7ro2y1.cloudfront.net/profile_image/basic_profilie_image.png";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  const [describeSelf, setDescribeSelf] = useState("");
  const [profileImgPath, setProfileImgPath] = useState(defaultImg);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  const fetchProfile = useCallback(async () => {
    setLoading(true);
  
    try {
      const userId = await AsyncStorage.getItem('userId');
      let accessToken = await AsyncStorage.getItem('accessToken');
      const storedProfileImg = await AsyncStorage.getItem('profileImgPath');
  
      console.log("User ID:", userId);
      console.log("Access Token:", accessToken);
  
      if (!userId || !accessToken) {
        console.error("User ID or access token is missing.");
        return;
      }
  
      if (storedProfileImg) {
        setProfileImgPath(storedProfileImg);
      }
  
      let response = await fetch(`${base_url}/api/users/${userId}/profiles`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 401) {
        accessToken = await refreshToken();
        if (accessToken) {
          response = await fetch(`${base_url}/api/users/${userId}/profiles`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
        }
      }
  
      if (response.ok) {
        const data = await response.json();
        const { nickname, name, describeSelf, profileImgPath } = data.data;
  
        setAccount(nickname || "닉네임 없음");
        setName(name || "이름 없음");
        setDescribeSelf(describeSelf || "");
  
        if (profileImgPath) {
          fetch(profileImgPath, { method: 'HEAD' })
            .then(res => res.ok ? setProfileImgPath(profileImgPath) : setProfileImgPath(defaultImg))
            .catch(() => setProfileImgPath(defaultImg));
          AsyncStorage.setItem('profileImgPath', profileImgPath);
        }
      } else {
        console.error("Failed to fetch profile information:", response.status);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  useLayoutEffect(() => {
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
