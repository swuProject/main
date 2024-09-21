import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function ProfileinfoScreen({ route }) {
  const { nickname } = route.params;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const navigation = useNavigation();
  
  const SERVER_URL = "https://tuituiworld.store:8443/api/profiles/nicknames/";

  const fetchUser = async () => {
    setLoading(true);
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      if (!accessToken) {
        Alert.alert("오류", "액세스 토큰이 없습니다");
        setLoading(false);
        return;
      }

      const response = await fetch(`${SERVER_URL}${encodeURIComponent(nickname)}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setUser(data.data);
        navigation.setOptions({
          headerTitle: data.data.nickname || "닉네임 없음",
        });
        
        // 팔로워 수를 설정
        const followerCount = data.data.followerList ? data.data.followerList.length : 0;
        setFollowerCount(followerCount); // 팔로워 수 상태 설정
        
        checkFollowingStatus(data.data.profileId);
      }else if (response.status === 404) {
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

  const checkFollowingStatus = async (followingId) => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    const profileId = await AsyncStorage.getItem("profileId");
  
    const response = await fetch(`https://tuituiworld.store:8443/api/profiles/follows/${profileId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    const data = await response.json();
    if (response.ok) {
      const followerList = data.data.followerList || [];
      const isCurrentlyFollowing = followerList.some(follow => follow.profileId === followingId);
      setIsFollowing(isCurrentlyFollowing);
  
      // 팔로워 수 업데이트
      setFollowerCount(data.data.followerList.length); 
    }
  };

  const followUser = async () => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    const followerId = await AsyncStorage.getItem("profileId");
    const followingId = user.profileId;
  
    const response = await fetch(`https://tuituiworld.store:8443/api/profiles/follows`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ followerId, followingId }),
    });
  
    const data = await response.json();
    console.log("팔로우 응답 데이터:", data);
  
    if (response.ok) {
      setIsFollowing(true);
      setFollowerCount(followerCount + 1);
      // 팔로워 목록 다시 가져오기
      await fetchFollowData(followingId, accessToken); // 팔로워 목록을 갱신
    } else {
      Alert.alert("오류", data.message || "팔로우에 실패했습니다.");
    }
  
    // 팔로우 상태 재확인
    checkFollowingStatus(followingId);
  };  
  
  const unfollowUser = async () => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    const followerId = await AsyncStorage.getItem("profileId");
    const followingId = user.profileId;
  
    const response = await fetch(`https://tuituiworld.store:8443/api/profiles/follows`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ followerId, followingId }),
    });
  
    const data = await response.json(); // 응답 데이터를 확인
    console.log("언팔로우 응답 데이터:", data);
  
    if (response.ok) {
      setIsFollowing(false);
      setFollowerCount(followerCount - 1); // 팔로워 수 감소
      checkFollowingStatus(followingId);
    } else {
      Alert.alert("오류", "언팔로우에 실패했습니다.");
    }
  };  
  
  useEffect(() => {
    fetchUser();
  }, [nickname]);

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
            <Text style={styles.statNumber}>0</Text>
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
