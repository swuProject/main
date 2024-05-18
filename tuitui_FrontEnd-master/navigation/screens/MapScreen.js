import * as React from "react";
import { View, Text } from "react-native";
import FeedText from "../../components/FeedText";

export default function MapScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 26, fontWeight: "bold" }}>Map Screen</Text>
    </View>
  );
}
