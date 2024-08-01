import React, { useState, useCallback, useLayoutEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const ProfileScreen = ({ route }) => {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [describeSelf, setDescribeSelf] = useState("");
  const [profileImgPath, setProfileImgPath] = useState(
    "https://d2ppx30y7ro2y1.cloudfront.net/profile_image/basic_profilie_image.png"
  ); // 기본 프로필 URL

  const navigation = useNavigation();

  const fetchProfile = useCallback(async () => {
    try {
      const storedNickname = await AsyncStorage.getItem('nickname');
      const storedName = await AsyncStorage.getItem('name');
      const storedDescribeSelf = await AsyncStorage.getItem('describeSelf');
      const storedProfileImgPath = await AsyncStorage.getItem('profileImgPath');

      if (storedNickname) setNickname(storedNickname);
      if (storedName) setName(storedName);
      if (storedDescribeSelf) setDescribeSelf(storedDescribeSelf);

      if (storedProfileImgPath && storedProfileImgPath.trim() !== "") {
        fetch(storedProfileImgPath, { method: 'HEAD' })
          .then(response => {
            if (response.ok) {
              setProfileImgPath(storedProfileImgPath);
            }
          })
          .catch(() => {
            setProfileImgPath(
              "https://d2ppx30y7ro2y1.cloudfront.net/profile_image/basic_profilie_image.png"
            );
          });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
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
          <Text style={styles.nickname}>{nickname || '닉네임 없음'}</Text>
        </View>
      ),
    });
  }, [navigation, nickname]);

  return (
    <View style={styles.container}>
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
    marginHorizontal: 28,
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
  nickname: {
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
