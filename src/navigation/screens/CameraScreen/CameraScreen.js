import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function CameraScreen() {
  const navigation = useNavigation();

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
}

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
