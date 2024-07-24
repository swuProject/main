import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [describeSelf, setDescribeSelf] = useState("");
  const [profileImgPath, setProfileImgPath] = useState(
    "https://d2ppx30y7ro2y1.cloudfront.net/profile_image/basic_profilie_image.png"
  ); // 기본 프로필 URL

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedNickname = await AsyncStorage.getItem("nickname");
        const storedName = await AsyncStorage.getItem("name");
        const storedDescribeSelf = await AsyncStorage.getItem("describeSelf");
        const storedProfileImgPath = await AsyncStorage.getItem(
          "profileImgPath"
        );

        if (storedNickname) setNickname(storedNickname);
        if (storedName) setName(storedName);
        if (storedDescribeSelf) setDescribeSelf(storedDescribeSelf);

        if (storedProfileImgPath && storedProfileImgPath.trim() !== "") {
          fetch(storedProfileImgPath, { method: "HEAD" })
            .then((response) => {
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
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

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
    backgroundColor: "#fff",
  },
  nickname: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
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
  },
  stats: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "#888",
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  editButtonText: {
    fontSize: 14,
    color: "#03C75A",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  describeSelf: {
    fontSize: 16,
    marginBottom: 16,
  },
  posts: {
    flexDirection: "row",
  },
  postImage: {
    width: 150,
    height: 150,
    marginRight: 8,
  },
});

export default ProfileScreen;
