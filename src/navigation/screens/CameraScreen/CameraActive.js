import React, { useState, useRef } from "react";
import { Animated, Easing } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Icon 사용을 위한 import

export default function CameraActive({ navigation }) {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null); // 카메라 참조 설정
  const [animationVisible, setAnimationVisible] = useState(false); // 애니메이션 상태
  const scaleValue = useRef(new Animated.Value(0)).current; // 애니메이션 스케일 값

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function takePicture() {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync(); // 사진 촬영
        const fileUri = `${
          FileSystem.documentDirectory
        }photo_${Date.now()}.jpg`;

        // 파일 시스템에서 파일 이동
        await FileSystem.moveAsync({
          from: photo.uri,
          to: fileUri,
        });

        // 갤러리에 저장
        await MediaLibrary.createAssetAsync(fileUri);
        console.log("Photo saved to gallery:", fileUri);

        // 애니메이션 시작
        setAnimationVisible(true);
        scaleValue.setValue(0); // 초기값 설정
        Animated.timing(scaleValue, {
          toValue: 1, // 최종 스케일 값
          duration: 500,
          easing: Easing.elastic(1), // 탄력 있는 애니메이션
          useNativeDriver: true,
        }).start(() => {
          setAnimationVisible(false); // 애니메이션 완료 후 숨김
        });
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    }
  }

  return (
    <View style={styles.container}>
      {/* 뒤로가기 버튼 */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={30} color="white" />
      </TouchableOpacity>

      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.shutterButton} onPress={takePicture}>
            <View style={styles.innerCircle} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={toggleCameraFacing}
          >
            <Icon name="flip-camera-ios" size={40} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>

      {/* 촬영 애니메이션 */}
      {animationVisible && (
        <Animated.View
          style={[
            styles.animationContainer,
            {
              transform: [{ scale: scaleValue }], // 스케일 애니메이션 적용
            },
          ]}
        >
          <Text style={styles.animationText}>촬영 완료!</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  shutterButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
  },
  innerCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
  },
  flipButton: {
    position: "absolute",
    right: 30,
  },
  animationContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
    zIndex: 10,
  },
  animationText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
