import * as React from "react";
import { View, Text } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, padding: '5%', marginTop: 32}}>
      <Text style={{fontSize: 24, letterSpacing: 8}}>
        TuiTui
      </Text>
    </View>
  );
}
