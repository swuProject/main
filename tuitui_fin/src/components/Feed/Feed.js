import React, { useState, useEffect } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { ColorSpace } from "react-native-reanimated";

const getCapsuleContent = async () => {
  const response = await fetch("http://13.124.69.147:8080/api/capsule");
  const data = await response.json();
  return data[0].content;
};

// 타임 캡슐 이미지와 내용 가져온다.
// 홈 스크린에서 시간순으로 전부 나열 스크롤뷰 사용해서 현재 보이는 화면만 데이터 처리.
function Feed() {
  // 가져온 캡슐 내용을 랜더링.(공부필요)
  const [capsuleContent, setCapsuleContent] = useState("");

  useEffect(() => {
    const fetchCapsuleContent = async () => {
      const Content = await getCapsuleContent();
      setCapsuleContent(Content);
    };
    fetchCapsuleContent();
  }, []);

  return (
    <View>
      <Image
        style={styles.capsuleImage}
        source={{
          uri: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzEwMTdfMTgy%2FMDAxNjk3NTMxNDg2MjYz.a0xugl5dJe8YoHNcJQe4DoHdGChRYOY9Edxp-F78g_cg.LIM-inmEX-z_5Mvb8pQmDTnkix8PPEerOtgKIUz3_2Mg.PNG.gustn5883%2F255275876_baby_cat%252C_cute_face.png&type=sc960_832",
        }}
      />
      <Text style={styles.capsuleContent}>{capsuleContent}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  capsuleImage: {
    marginTop: 4,
    width: "100%",
    height: "72%",
  },
  capsuleContent: {
    marginTop: 4,
    fontSize: 16,
    padding: 8,
  },
});

export default Feed;
