import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  ActivityIndicator,
  Image,
} from "react-native";

// page와 limit 사용해서 데이터 타임캡슐 데이터 가져옴.
const GetCapsule = async (page, limit) => {
  const response = await fetch(
    `http://13.124.69.147:8080/api/test/capsule?page=${page}&limit=${limit}`
  );
  const data = await response.json();
  return data;
};

// 유저아이디, 내용, 이미지 출력
const Item = ({ writeUser, content, imageList }) => {
  // imageList 배열의 첫 번째 객체의 imagePath를 사용.
  const imageUrl =
    imageList && imageList.length > 0 ? imageList[0].imagePath : null;

  return (
    <View style={styles.item}>
      <Text style={styles.title}>{writeUser}</Text>
      {imageUrl ? (
        <Image style={styles.image} source={{ uri: imageUrl }} />
      ) : (
        <Text>이미지 없음</Text>
      )}
      <Text style={styles.content}>{content}</Text>
    </View>
  );
};

const HomeScreen = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  //로딩 표시 및 데이터 호출갯수 5개로 제한.
  const fetchData = async () => {
    if (loading) return;
    setLoading(true);
    const result = await GetCapsule(page, 10);
    console.log("Fetched data:", result); // 데이터 확인용 로그
    setData((prevData) => [...prevData, ...result]);
    setPage((prevPage) => prevPage + 1);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 스크롤이 끝에 도달했을 때 추가 데이터를 로드.
  const handleLoadMore = () => {
    fetchData();
  };

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="large" color="#0000ff" />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <Item
            content={item.content}
            writeUser={item.writeUser}
            imageList={item.imageList} // imageList 배열 전달
          />
        )}
        keyExtractor={(item) => item.capsuleId.toString()}
        onEndReached={handleLoadMore} // 리스트 끝에 도달하면 'handleLoadMore' 함수를 호출.
        onEndReachedThreshold={0.75} // 스크롤이 어느 정도 남았을 때 onEndReached함수를 호출할 지 설정.
        ListFooterComponent={renderFooter} // 로딩 스피너 표시.
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: "white",
  },
  item: {
    backgroundColor: "white",
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 0,
  },
  title: {
    fontSize: 24,
  },
  content: {
    fontSize: 16,
    marginVertical: 8,
  },
  image: {
    flex: 1,
    width: null,
    height: 200,
    marginTop: 8,
  },
});

export default HomeScreen;
