import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function ChangePwScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>비밀번호 변경</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});