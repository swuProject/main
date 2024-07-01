import * as React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ProFileOptionScreen() {
  return (
    <View>
      <Text style={styles.font}>계정 관리</Text>
      <Text style={styles.font}>알림 설정</Text>
      <Text style={styles.font}>차단 관리</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
  },
  font: {
    marginTop: 16,
    marginBottom: 20,
    fontSize: 28,
    borderBottomWidth: 3,
    borderColor: "red", //실선 만들자.
  },
});
