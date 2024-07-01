import * as React from "react";
import { View, Text, StyleSheet } from "react-native";

import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

function CameraScreen() {
  // const cameraPermission = Camera.getCameraPermissionStatus()
  // const microphonePermission = Camera.getMicrophonePermissionStatus()

  // const newCameraPermission = await Camera.requestCameraPermission()
  // const newMicrophonePermission = await Camera.requestMicrophonePermission()

  // const device = useCameraDevice('back')
  // const { hasPermission } = useCameraPermission()

  // if (!hasPermission) return <PermissionsPage />
  // if (device == null) return <NoCameraDeviceError />
  // return (
  //   <Camera
  //     style={StyleSheet.absoluteFill}
  //     device={device}
  //     isActive={true}
  //   />
  // )
  return (
    <View>
      <Text>Hello</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CameraScreen;
