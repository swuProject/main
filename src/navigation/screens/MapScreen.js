import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // AsyncStorage import

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState(null);
  const [capsules, setCapsules] = useState([]); // 캡슐 데이터를 저장할 상태

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      setLocation(coords);
      setRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.5, // 5km 반경을 위한 확대 조정
        longitudeDelta: 0.5,
      });

      // 캡슐 데이터를 가져오는 함수 호출
      fetchCapsules();
    })();
  }, []);

  // API를 호출하여 캡슐 데이터를 가져오는 함수
  const fetchCapsules = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken"); // JWT 토큰 가져오기

      const response = await axios.get(
        "https://tuituiworld.store:8443/api/capsules",
        {
          headers: {
            Authorization: `Bearer ${token}`, // JWT 토큰을 Authorization 헤더에 추가
          },
        }
      );

      const { data } = response.data;
      setCapsules(data.contents); // 캡슐 데이터를 상태에 저장
    } catch (error) {
      console.error("Error fetching capsules:", error);
      setErrorMsg("Failed to fetch capsules.");
    }
  };

  // 주소 검색 핸들러
  const handleSearch = async () => {
    try {
      const result = await Location.geocodeAsync(address);
      if (result.length > 0) {
        const { latitude, longitude } = result[0];
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.5, // 5km 반경을 위한 확대 조정
          longitudeDelta: 0.5,
        });
      } else {
        setErrorMsg("Address not found");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Error searching address");
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        followsUserLocation={true}
        onRegionChangeComplete={setRegion} // 지역 변경 시 region을 업데이트
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="You are here"
            description="Your current location"
          />
        )}

        {/* 타임캡슐 위치에 마커 표시 */}
        {capsules.map((capsule) => (
          <Marker
            key={capsule.capsuleId}
            coordinate={{
              latitude: capsule.latitude,
              longitude: capsule.longitude,
            }}
            title={capsule.nickname}
            description={capsule.content}
          />
        ))}
      </MapView>

      <View style={styles.overlay}>
        <TextInput
          style={styles.input}
          placeholder="장소•주소 검색"
          value={address}
          onChangeText={setAddress}
        />
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>검색</Text>
        </TouchableOpacity>
        {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  map: {
    ...StyleSheet.absoluteFillObject, // 화면 꽉 채우기
  },
  overlay: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // 반투명하게
    borderRadius: 8,
  },
  input: {
    height: 40,
    borderColor: "#BBBBBB",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});
