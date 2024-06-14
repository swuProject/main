import { View, Text, Image, StyleSheet } from "react-native";
import React, { useState, useEffect, TextInput } from "react";

const getUserRealName = async () => {
  const response = await fetch("http://13.124.69.147:8080/api/user");
  const data = await response.json();
  return data[0].name;
};

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

const ProfileFixScreen = () => {
  // 가져온 유저아이디를 랜더링.(공부필요)
  const [realName, setRealname] = useState("");

  useEffect(() => {
    const fetchRealname = async () => {
      const realName = await getUserRealName();
      setRealname(realName);
    };
    fetchRealname();
  }, []);

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
        <Text style={styles.changeButton}>사진 변경</Text>
      </View>
      <View style={styles.textBox}>
        <Text style={styles.font}>이름</Text>
        <Text style={styles.font}>{realName}</Text>
      </View>
      <View style={styles.textBox}>
        <Text style={styles.font}>닉네임</Text>
        <Text style={styles.font}>{nickname}</Text>
      </View>
      <View style={styles.textBox}>
        <Text style={styles.font}>설명</Text>
        <Text style={styles.font}>{describeSelf}</Text>
      </View>
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

  changeButton: {
    marginTop: 12,
    fontSize: 16,
    color: "#03C75A",
  },
  describe: {
    marginTop: 20,
    fontSize: 32,
    marginLeft: 8,
  },
  font: {
    marginTop: 32,
    fontSize: 24,
    marginLeft: 20,
    marginRight: 100,
  },
  textBox: {
    flexDirection: "row",
  },
});

export default ProfileFixScreen;
