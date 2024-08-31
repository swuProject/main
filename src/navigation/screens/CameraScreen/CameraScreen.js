import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

// Screens
import CameraActive from "./CameraActive";

const CameraStack = createStackNavigator();

const CameraScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* 게시글 작성 버튼 */}
      <TouchableOpacity style={styles.postButton}>
        <Text style={styles.buttonText}>게시글 작성</Text>
      </TouchableOpacity>

      {/* 카메라 촬영 버튼 */}
      <TouchableOpacity
        style={styles.cameraButton}
        onPress={() => navigation.navigate("CameraActive")}
      >
        <Text style={styles.buttonText}>카메라 촬영</Text>
      </TouchableOpacity>
    </View>
  );
};

const CameraStackScreen = () => {
  return (
    <CameraStack.Navigator
      screenOptions={{
        headerShown: false, // 헤더를 숨기기 위한 옵션
      }}
    >
      <CameraStack.Screen
        name="CameraScreen"
        component={CameraScreen}
        options={{ title: "Camera" }}
      />
      <CameraStack.Screen
        name="CameraActive"
        component={CameraActive}
        options={{ title: "Camera Active" }}
      />
    </CameraStack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  postButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  cameraButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default CameraStackScreen;
