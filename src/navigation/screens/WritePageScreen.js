import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import Swiper from "react-native-swiper";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage"; // AsyncStorage 추가

export default function WritePageScreen({ navigation }) {
  const [text, setText] = useState(""); // 글 내용 상태
  const [images, setImages] = useState([]); // 선택된 이미지 상태
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 슬라이드 인덱스
  const [daysLater, setDaysLater] = useState(1); // 선택된 날짜
  const [isDayPickerVisible, setIsDayPickerVisible] = useState(false); // 날짜 선택창 표시 여부
  const [location, setLocation] = useState(null); // 위치 정보 상태
  const [profileId, setProfileId] = useState(46); // 현재 유저의 profileId (임시로 46)

  const base_url = "https://tuituiworld.store:8443";

  // 이미지 선택 핸들러
  const selectImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("카메라 롤에 접근할 수 없습니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // 여러 장 선택 가능
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => asset.uri);
      setImages([...images, ...selectedImages]);
    }
  };

  // 위치 정보를 가져오는 함수
  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("위치 접근 권한이 필요합니다.");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    } catch (error) {
      console.error(error);
    }
  };

  // 컴포넌트가 마운트될 때 위치 정보를 가져옴
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("푸시 알림 권한이 필요합니다.");
      }
    };

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    requestPermissions();
    getLocation();
  }, []);

  // 타임캡슐 저장 핸들러 (fetch 사용)
  const saveCapsule = async () => {
    if (!location) {
      alert("위치 정보를 가져오지 못했습니다.");
      return;
    }

    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      console.log("Access Token:", accessToken);

      // FormData 객체 생성
      const formData = new FormData();

      // request 키로 감싸서 데이터 추가
      const request = {
        profileId: await AsyncStorage.getItem("profileId"),
        content: text,
        location: "경기도 화성시 동탄지성로",
        remindDate: daysLater,
        latitude: location.latitude,
        longitude: location.longitude,
      };

      // request 데이터 추가 (필요한 경우 request 키로 감쌉니다)
      formData.append("request", JSON.stringify(request));

      // 이미지 추가 (서버가 '파일' 키로 이미지를 받는다고 가정)
      images.forEach((imageUri) => {

        formData.append("file", {
          uri: imageUri,
          type: "image/jpeg",
          name: "post.jpg",
        });
      });

      console.log("Sending data:", formData); // 확인용

      // API 요청
      const response = await fetch(`${base_url}/api/capsules/with-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`, // 인증 토큰 추가
          "Content-Type": "multipart/form-data", // multipart/form-data 형식
        },
        body: formData, // FormData 객체 전송
      });

      console.log("Response status:", response.status);
      const responseText = await response.text();
      console.log("Response text:", responseText);

      if (response.ok) {
        setNotification(daysLater); // 저장 후 타임캡슐 알림 호출

        navigation.navigate("Home");
      } else {
        console.log("서버 오류:", responseText);
        alert(
          `타임캡슐 저장에 실패했습니다: ${response.status} - ${responseText}`
        );
      }
    } catch (error) {
      console.error("서버 오류:", error);
      alert("타임캡슐 저장 중 오류가 발생했습니다.");
    }
  };

  // 날짜 선택 버튼 표시 핸들러
  const showDayPicker = () => {
    setIsDayPickerVisible(true);
  };

  // "몇 일 후" 선택 목록 데이터 생성
  const days = Array.from({ length: 365 }, (_, index) => index + 1);

  // 알림
  const setNotification = async (daysLater) => {
    const triggerTime = new Date();
    triggerTime.setDate(triggerTime.getDate() + daysLater); // daysLater 후의 날짜 계산

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "TuiTui",
        body: "앱을 열어 추억을 확인해 보세요 !",
      },
      trigger: {
        date: triggerTime,
      },
    });

    console.log(`${daysLater}일 후에 알림이 설정되었습니다.`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* 이미지 업로드 버튼 */}
        <TouchableOpacity
          style={styles.imageUploadButton}
          onPress={selectImage}
        >
          <Icon name="photo-camera" size={24} color="#fff" />
          <Text style={styles.imageUploadButtonText}>사진 업로드</Text>
        </TouchableOpacity>

        {/* 선택된 이미지 슬라이드 미리보기 */}
        {images.length > 0 && (
          <View style={styles.swiperContainer}>
            <Swiper
              showsPagination={true}
              loop={false}
              onIndexChanged={(index) => setCurrentIndex(index)}
              paginationStyle={styles.pagination}
              activeDotColor="#007AFF"
              dotColor="#ccc"
            >
              {images.map((image, index) => (
                <View key={index} style={styles.slide}>
                  <Image source={{ uri: image }} style={styles.image} />
                </View>
              ))}
            </Swiper>
            <Text style={styles.imageCounter}>
              {currentIndex + 1} / {images.length}
            </Text>
          </View>
        )}

        {/* 글 내용 입력란 */}
        <TextInput
          style={styles.input}
          placeholder="내용을 입력하세요..."
          multiline={true}
          value={text}
          onChangeText={setText}
        />

        {/* "몇 일 후" 선택 버튼 및 선택된 날짜 표시 */}
        <View style={styles.dayPickerContainer}>
          <TouchableOpacity style={styles.customButton} onPress={showDayPicker}>
            <Text style={styles.customButtonText}>타임캡슐 알림 설정</Text>
          </TouchableOpacity>
          <Text style={styles.selectedDays}>선택된 날짜: {daysLater}일 후</Text>
        </View>

        {/* 타임캡슐 저장 버튼 */}
        <TouchableOpacity style={styles.customButton} onPress={saveCapsule}>
          <Text style={styles.customButtonText}>타임캡슐 저장</Text>
        </TouchableOpacity>

        {/* 날짜 선택 모달 */}
        {isDayPickerVisible && (
          <Modal transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.pickerWrapper}>
                <FlatList
                  data={days}
                  keyExtractor={(item) => item.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dayItem}
                      onPress={() => {
                        setDaysLater(item);
                        setIsDayPickerVisible(false);
                      }}
                    >
                      <Text style={styles.dayText}>{item}일</Text>
                    </TouchableOpacity>
                  )}
                  showsVerticalScrollIndicator={false}
                  style={styles.dayList}
                />
                <TouchableOpacity
                  style={[styles.customButton, styles.cancelButton]}
                  onPress={() => setIsDayPickerVisible(false)}
                >
                  <Text style={styles.customButtonText}>취소</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  innerContainer: {
    padding: 20,
  },
  input: {
    height: 200,
    padding: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    textAlignVertical: "top",
    marginTop: 20,
  },
  imageUploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  imageUploadButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  swiperContainer: {
    height: 300,
    marginBottom: 20,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 5,
  },
  pagination: {
    bottom: 10,
  },
  imageCounter: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  dayPickerContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  selectedDays: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
    textAlign: "center", // 날짜를 가운데 정렬
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center", // 중앙에 위치
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // 모달 배경 어둡게
  },
  pickerWrapper: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  dayItem: {
    padding: 10,
  },
  dayText: {
    fontSize: 18,
  },
  dayList: {
    maxHeight: 300, // 최대 높이 설정
  },
  customButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2, // 안드로이드 그림자
  },
  customButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#ff3b30", // 취소 버튼의 색상
  },
});
