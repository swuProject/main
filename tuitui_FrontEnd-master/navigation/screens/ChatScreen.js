import * as React from "react";
import { View, Text } from "react-native";
import SearchBox from "../../components/SearchBox";

export default function ChatScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", marginTop: 80}}>
      <SearchBox/>
    </View>
  );
}
