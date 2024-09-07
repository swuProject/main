import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

export default function ProfileOptionScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.optionContainer} onPress={() => navigation.navigate('DeleteUser')}>
        <Text style={styles.optionText}>계정 관리</Text>
      </TouchableOpacity>
      <View style={styles.optionContainer}>
        <Text style={styles.optionText}>알림 설정</Text>
      </View>
      <View style={styles.optionContainer}>
        <Text style={styles.optionText}>차단 관리</Text>
      </View>
      <TouchableOpacity style={styles.optionContainer} onPress={() => navigation.navigate('Logout')}>
        <Text style={styles.optionText}>로그아웃</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  optionContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: {
    fontSize: 18,
  },
});
