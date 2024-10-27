import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Image, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CapsuleScreen = ({ capsuleId, onClose }) => {
  const [capsule, setCapsule] = useState(null); // 캡슐 데이터 상태
  const base_url = "https://tuituiworld.store";

  // 캡슐 데이터 가져오기
  const fetchCapsuleData = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken"); // JWT 토큰 가져오기
      const response = await fetch(`${base_url}/api/capsules/${capsuleId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // JWT 토큰을 Authorization 헤더에 추가
        },
      });
      const data = await response.json();

      if (response.ok) {
        setCapsule(data.data); // 캡슐 데이터를 상태에 저장
      } else {
        console.error("Error fetching capsule data:", data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (capsuleId) {
      fetchCapsuleData(); // 캡슐 아이디가 있을 때만 데이터 가져오기
    }
  }, [capsuleId]);

  return (
    <View style={styles.container}>
      {!capsule ? (
        <Text>로딩 중...</Text>
      ) : (
        <>
          <View style={styles.headerContainer}>
            <Image
              source={{ uri: capsule.profileImgPath }}
              style={styles.profileImage}
            />
            <Text style={styles.nickname}>{capsule.nickname}</Text>
          </View>
          <Text style={styles.content}>내용: {capsule.content}</Text>
          <Text>위치: {capsule.location}</Text>
          <Text>저장 날짜: {capsule.remindDate}일 후</Text>

          <FlatList
            data={capsule.imageList}
            keyExtractor={(item) => item.imageId.toString()}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item.imagePath }}
                style={styles.capsuleImage}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
          />

          <Button title="닫기" onPress={onClose} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  nickname: {
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    marginBottom: 10,
  },
  capsuleImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
});

export default CapsuleScreen;
