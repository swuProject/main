import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Linking,
} from "react-native";

const TourScreen = () => {
  const [tourData, setTourData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTourData(page);
  }, [page]);

  const fetchTourData = async (pageNum) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://jy3lh3sugl.execute-api.ap-northeast-2.amazonaws.com/default/suggested_tour_list?latitude=37.568477&longitude=126.981611&numOfRows=4&page=${pageNum}`
      );
      const data = await response.json();
      setTourData((prevData) => [...prevData, ...data.result]); // 이전 데이터에 새 데이터를 추가
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching tour data:", error);
    }
    setLoading(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image
        source={{ uri: item.firstimage }} // 이미지 URL
        style={styles.image}
        resizeMode="cover" // 이미지를 잘 보이도록 크기 조정
      />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.address}>{item.addr1}</Text>
      <Text style={styles.distance}>Distance: {item.dist} meters</Text>
      <TouchableOpacity onPress={() => handlePress(item.mapx, item.mapy)}>
        <Text style={styles.link}>View on Map</Text>
      </TouchableOpacity>
    </View>
  );

  const handlePress = (mapx, mapy) => {
    // 지도앱으로 이동 (구글맵 등으로)
    const url = `https://maps.google.com/?q=${mapy},${mapx}`;
    Linking.openURL(url);
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1); // 다음 페이지 로드
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && page === 1 ? ( // 첫 페이지 로딩 중이면 인디케이터 표시
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={tourData}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.contentid}-${index}`} // contentid와 인덱스를 결합하여 유일한 키 생성
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading && page > 1 ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = {
  container: { flex: 1, padding: 16 },
  item: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 16,
  },
  image: { width: "100%", height: 200, borderRadius: 8 },
  title: { fontSize: 18, fontWeight: "bold", marginVertical: 8 },
  address: { fontSize: 14, color: "#666" },
  distance: { fontSize: 12, color: "#888", marginTop: 4 },
  link: { fontSize: 14, color: "#1e90ff", marginTop: 8 },
};

export default TourScreen;
