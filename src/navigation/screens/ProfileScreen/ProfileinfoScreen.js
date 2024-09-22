import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function ProfileinfoScreen({ route }) {
  const { nickname } = route.params;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(null); // 초기값 null
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const navigation = useNavigation();

  const SERVER_URL = "https://tuituiworld.store:8443/api/profiles/nicknames/";

  const fetchUser = async () => {
    setLoading(true);
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      if (!accessToken) {
        Alert.alert("오류", "액세스 토큰이 없습니다");
        return;
      }

      const response = await fetch(`${SERVER_URL}${encodeURIComponent(nickname)}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data);
        navigation.setOptions({
          headerTitle: data.data.nickname || "닉네임 없음",
        });
        await checkFollowingStatus(data.data.profileId);
      } else if (response.status === 404) {
        Alert.alert("오류", "해당 유저를 찾을 수 없습니다.");
      } else {
        Alert.alert("오류", "알 수 없는 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("오류", "서버 상태를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const checkFollowingStatus = async (followerId) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const currentUserId = await AsyncStorage.getItem("profileId");

      const response = await fetch(`https://tuituiworld.store:8443/api/profiles/follows/${followerId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const { followerList, followingList } = data.data;

        setFollowerCount(followerList ? followerList.length : 0);
        setFollowingCount(followingList ? followingList.length : 0);

        const isCurrentlyFollowing = followerList && followerList.some(user => user.profileId === Number(currentUserId));
        setIsFollowing(isCurrentlyFollowing); // 팔로우 하고 있는지 저장
      }
    } catch (error) {
      console.error('팔로워/팔로잉 데이터 가져오기 오류:', error);
    }
  };

  const followUser = async () => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    const followerId = user.profileId; // 팔로우 당하는 사람
    const followingId = await AsyncStorage.getItem("profileId"); // 팔로우 하는 사람

    const response = await fetch(`https://tuituiworld.store:8443/api/profiles/follows`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ followerId, followingId }),
    });

    if (response.ok) {
      setIsFollowing(true);
      setFollowerCount(prev => prev + 1); // 이전 값 기반으로 업데이트
    } else {
      const data = await response.json();
      Alert.alert("오류", data.message);
    }
  };

  const unfollowUser = async () => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    const followerId = user.profileId; // 팔로우 당하는 사람
    const followingId = await AsyncStorage.getItem("profileId"); // 팔로우 받는 사람

    const response = await fetch(`https://tuituiworld.store:8443/api/profiles/follows`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ followerId, followingId }),
    });

    if (response.ok) {
      setIsFollowing(false);
      setFollowerCount(prev => prev - 1); // 이전 값 기반으로 업데이트
    } else {
      const data = await response.json();
      Alert.alert("오류", data.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [nickname]);

  useEffect(() => {
    if (user) {
      checkFollowingStatus(user.profileId);
    }
  }, [user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>유저를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          style={styles.img}
          source={{ uri: user.profileImgPath || "https://d2ppx30y7ro2y1.cloudfront.net/profile_image/basic_profilie_image.png" }}
        />
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>게시글</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{followerCount}</Text>
            <Text style={styles.statLabel}>팔로워</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{followingCount}</Text>
            <Text style={styles.statLabel}>팔로잉</Text>
          </View>
        </View>
      </View>
      <Text style={styles.name}>{user.name || "이름 없음"}</Text>
      <Text style={styles.describeSelf}>{user.describeSelf || ""}</Text>

      <TouchableOpacity 
        style={styles.button}
        onPress={isFollowing ? unfollowUser : followUser}
      >
        <Text style={styles.buttonText}>{isFollowing ? "언팔로우" : "팔로우"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  stat: {
    alignItems: "center",
    marginHorizontal: 24,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "#888",
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  describeSelf: {
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
