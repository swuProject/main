import React, { useState, useEffect } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
// api로부터 유저 아아디 가져옴
const getUserNickName = async () => {
  const response = await fetch("http://13.124.69.147:8080/api/profile/1");
  const data = await response.json();
  return data.nickname;
};
// 가져온 유저아이디를 랜더링.(공부필요)
function UserTag() {
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const fetchNickname = async () => {
      const name = await getUserNickName();
      setNickname(name);
    };
    fetchNickname();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        style={styles.img}
        source={{
          uri: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzEwMTdfMTgy%2FMDAxNjk3NTMxNDg2MjYz.a0xugl5dJe8YoHNcJQe4DoHdGChRYOY9Edxp-F78g_cg.LIM-inmEX-z_5Mvb8pQmDTnkix8PPEerOtgKIUz3_2Mg.PNG.gustn5883%2F255275876_baby_cat%252C_cute_face.png&type=sc960_832",
        }}
      />
      <Text style={styles.font}>{nickname}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    backgroundColor: 'white',
  },
  img: {
    width: 32,
    height: 32,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  font: {
    fontSize: 14,
    marginLeft: 8,
  },
});

export default UserTag;
