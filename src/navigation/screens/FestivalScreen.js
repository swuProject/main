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
import Geolocation from "react-native-geolocation-service";

const TourScreen = () => {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    // 유저 위치 받아오기
    Geolocation.getCurrentPosition(
      (position) => {
        //
        setLatitude(position.coords.latitude);
        //
        setLongitude(position.coords.longitude);
      },
      (error) => {
        console.error(error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      fetchFestivals(); // 위치가 설정되면 API 호출
    }
  }, [latitude, longitude]);

  const fetchFestivals = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://jy3lh3sugl.execute-api.ap-northeast-2.amazonaws.com/default/get-festa-list?latitude=${latitude}&longitude=${longitude}`
      );
      const data = await response.json();
      setFestivals(data.festivals); // 축제 데이터를 상태에 저장
    } catch (error) {
      console.error("Error fetching festivals:", error);
    }
    setLoading(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image
        source={{ uri: item.image_url }}
        style={styles.image}
        resizeMode="contain" // 이미지 비율을 유지하면서 크기에 맞게 조정
      />
      <Text style={styles.title}>{item.festival_name}</Text>
      <Text style={styles.address}>{item.short_address}</Text>
      <Text style={styles.dates}>
        {item.start_date} - {item.end_date}
      </Text>
      <TouchableOpacity onPress={() => handlePress(item.homepage)}>
        <Text style={styles.link}>More Info</Text>
      </TouchableOpacity>
    </View>
  );

  const handlePress = (url) => {
    // 웹페이지로 이동
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={festivals}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </SafeAreaView>
  );
};

const styles = {
  container: { flex: 1, padding: 16 },
  item: { marginBottom: 16 },
  image: { width: "100%", height: 200, borderRadius: 8 },
  title: { fontSize: 18, fontWeight: "bold", marginVertical: 8 },
  address: { fontSize: 14, color: "#666" },
  dates: { fontSize: 14, color: "#888" },
  link: { fontSize: 14, color: "#1e90ff", marginTop: 8 },
};

export default TourScreen;
