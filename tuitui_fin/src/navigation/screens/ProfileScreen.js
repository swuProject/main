import { View, Text, Image, StyleSheet } from "react-native";
import React, { useState, useEffect, TextInput } from "react";

const getUserNickName = async () => {
  const response = await fetch("http://13.124.69.147:8080/api/profile/1");
  const data = await response.json();
  return data.nickname;
};

const getUserDescribeSelf = async () => {
  const response = await fetch("http://13.124.69.147:8080/api/profile/1");
  const data = await response.json();
  return data.describeSelf;
};

const ProfileScreen = () => {
  // 가져온 유저아이디를 랜더링.(공부필요)
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const fetchNickname = async () => {
      const name = await getUserNickName();
      setNickname(name);
    };
    fetchNickname();
  }, []);

  const [describeSelf, setDescribeSelf] = useState("");

  useEffect(() => {
    const fetchDescribeSelf = async () => {
      const desSelf = await getUserDescribeSelf();
      setDescribeSelf(desSelf);
    };
    fetchDescribeSelf();
  }, []);

  return (
    <View>
      <View style={styles.container}>
        <Image
          style={styles.img}
          source={{
            uri: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzEwMTdfMTgy%2FMDAxNjk3NTMxNDg2MjYz.a0xugl5dJe8YoHNcJQe4DoHdGChRYOY9Edxp-F78g_cg.LIM-inmEX-z_5Mvb8pQmDTnkix8PPEerOtgKIUz3_2Mg.PNG.gustn5883%2F255275876_baby_cat%252C_cute_face.png&type=sc960_832",
          }}
        />
        <Text style={styles.font}>{nickname}</Text>
      </View>
      <Text style={styles.describe}>{describeSelf}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 28,
    alignItems: "center",
    marginLeft: 10,
  },
  img: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  font: {
    fontSize: 32,
    marginLeft: 8,
  },
  describe: {
    marginTop: 20,
    fontSize: 32,
    marginLeft: 8,
  },
});

export default ProfileScreen;
