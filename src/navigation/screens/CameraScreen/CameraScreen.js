import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons"; // 아이콘을 가져오기 위한 임포트

// Screens
import CameraActive from "./CameraActive";
import WritePage from "../WritePageScreen";
import ARScreen from './ARScreen'; // AR 스크린 컴포넌트를 import 해야 합니다

const CameraStack = createStackNavigator();

const CameraScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* 게시글 작성 버튼 */}
      <TouchableOpacity
        style={styles.postButton}
        onPress={() => navigation.navigate("WritePage")}
      >
        <Text style={styles.buttonText}>게시글 작성</Text>
      </TouchableOpacity>

      {/* 카메라 촬영 버튼 */}
      <TouchableOpacity
        style={styles.cameraButton}
        onPress={() => navigation.navigate("CameraActive")}
      >
        <Text style={styles.buttonText}>카메라 촬영</Text>
      </TouchableOpacity>

      {/* AR 체험하기 버튼 추가 */}
      <TouchableOpacity
        style={styles.arButton}
        onPress={() => navigation.navigate("ARScreen")}
      >
        <Text style={styles.buttonText}>AR 체험하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const CameraStackScreen = () => {
  return (
    <CameraStack.Navigator>
      <CameraStack.Screen
        name="CameraScreen"
        component={CameraScreen}
        options={{
          title: "Camera",
          headerShown: false,
        }}
      />
      <CameraStack.Screen
        name="CameraActive"
        component={CameraActive}
        options={{
          title: "Camera Active",
          headerShown: false,
        }}
      />
      <CameraStack.Screen
        name="WritePage"
        component={WritePage}
        options={{
          title: "타임캡슐 작성",
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: "bold",
          },
          headerBackTitleVisible: false, // 뒤로 가기 버튼의 텍스트를 숨김
          headerBackImage: () => (
            <Ionicons
              name="chevron-back-outline"
              size={24}
              color="black"
              style={{ paddingLeft: 10 }}
            />
          ),
        }}
      />
      {/* AR 스크린 추가 */}
      <CameraStack.Screen
        name="ARScreen"
        component={ARScreen}
        options={{
          title: "AR 체험",
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: "bold",
          },
          headerBackTitleVisible: false,
          headerBackImage: () => (
            <Ionicons
              name="chevron-back-outline"
              size={24}
              color="black"
              style={{ paddingLeft: 10 }}
            />
          ),
        }}
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
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  cameraButton: {
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  arButton: {
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,  // 위 버튼과의 간격
  },
});

export default CameraStackScreen;
