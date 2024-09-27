import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState(null);
  const [capsules, setCapsules] = useState([]); // 캡슐 데이터를 저장할 상태
  const [isModalVisible, setIsModalVisible] = useState(false); // 주변 캡슐 모달 상태
  const [isCapsuleDetailModalVisible, setIsCapsuleDetailModalVisible] =
    useState(false); // 캡슐 상세 모달 상태
  const [selectedCapsules, setSelectedCapsules] = useState([]); // 선택된 마커 주변의 캡슐들
  const [selectedCapsuleDetail, setSelectedCapsuleDetail] = useState(null); // 선택된 캡슐 상세 정보

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
          latitudeDelta: 0.1, // 500m 반경을 위한 확대 조정
          longitudeDelta: 0.1,
        });
      } else {
        setErrorMsg("Address not found");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Error searching address");
    }
  };

  // 모달 표시 핸들러
  const handleMarkerPress = (capsule) => {
    // 클릭한 마커 근처의 캡슐들 필터링 (예: 같은 위도/경도 또는 특정 반경 내)
    const nearbyCapsules = capsules.filter(
      (c) =>
        Math.abs(c.latitude - capsule.latitude) < 0.01 &&
        Math.abs(c.longitude - capsule.longitude) < 0.01
    );

    setSelectedCapsules(nearbyCapsules);
    setIsModalVisible(true); // 주변 캡슐 모달 표시
  };

  // 주변 캡슐 아이템 클릭 핸들러
  const handleCapsuleItemPress = (capsule) => {
    setSelectedCapsuleDetail(capsule);
    setIsCapsuleDetailModalVisible(true); // 캡슐 상세 모달 표시
  };

  // 모달 닫기 핸들러
  const closeModal = () => {
    setIsModalVisible(false);
  };

  // 캡슐 상세 모달 닫기 핸들러
  const closeCapsuleDetailModal = () => {
    setIsCapsuleDetailModalVisible(false);
    setSelectedCapsuleDetail(null); // 모달 닫을 때 상세 정보 초기화
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        followsUserLocation={true}
        onRegionChangeComplete={setRegion}
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
        {capsules.map((capsule) => {
          const imageUrl =
            capsule.imageList && capsule.imageList.length > 0
              ? capsule.imageList[0].imagePath
              : "https://example.com/default_marker.png"; // 기본 마커 이미지

          return (
            <Marker
              key={capsule.capsuleId}
              coordinate={{
                latitude: capsule.latitude,
                longitude: capsule.longitude,
              }}
              onPress={() => handleMarkerPress(capsule)} // 마커 클릭 시
            >
              <View style={styles.customMarker}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.markerImage}
                  resizeMode="cover"
                />
              </View>
              <Callout>
                <Text>{capsule.nickname}</Text>
                <Text>{capsule.content}</Text>
              </Callout>
            </Marker>
          );
        })}
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

      {/* 주변 캡슐 모달 */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={closeModal} // 모달 밖을 클릭하면 닫기
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>주변 캡슐 목록</Text>
          <FlatList
            data={selectedCapsules}
            keyExtractor={(item) => item.capsuleId.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleCapsuleItemPress(item)}>
                <View style={styles.capsuleItem}>
                  <Image
                    source={{
                      uri:
                        item.imageList && item.imageList.length > 0
                          ? item.imageList[0].imagePath
                          : "https://example.com/default_marker.png",
                    }}
                    style={styles.capsuleImage}
                  />
                  <View style={styles.capsuleText}>
                    <Text style={styles.capsuleNickname}>{item.nickname}</Text>
                    <Text>{item.content}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* 캡슐 상세 모달 */}
      <Modal
        isVisible={
          isCapsuleDetailModalVisible && selectedCapsuleDetail !== null
        }
        onBackdropPress={closeCapsuleDetailModal} // 모달 밖을 클릭하면 닫기
        style={styles.modal}
      >
        {selectedCapsuleDetail && (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedCapsuleDetail.nickname}
            </Text>
            <Image
              source={{
                uri:
                  selectedCapsuleDetail.imageList &&
                  selectedCapsuleDetail.imageList.length > 0
                    ? selectedCapsuleDetail.imageList[0].imagePath
                    : "https://example.com/default_marker.png",
              }}
              style={styles.capsuleDetailImage}
            />
            <Text style={styles.modalContentText}>
              {selectedCapsuleDetail.content}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeCapsuleDetailModal}
            >
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
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
  customMarker: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#007BFF",
  },
  markerImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  capsuleItem: {
    flexDirection: "row",
    marginBottom: 10,
  },
  capsuleImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  capsuleText: {
    flex: 1,
  },
  capsuleNickname: {
    fontWeight: "bold",
  },
  capsuleDetailImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalContentText: {
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
