import React, { useState, useRef } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Icon 사용을 위한 import

export default function CameraActive({ navigation }) {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null); // 카메라 참조 설정

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
        await FileSystem.moveAsync({
          from: photo.uri,
          to: fileUri,
        });
        console.log("Photo saved to:", fileUri);
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
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
