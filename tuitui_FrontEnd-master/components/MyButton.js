import React from "react";
import { TouchableOpacity, Text, Button } from "react-native";

const MyButton = () => {
  return (
    <>
      <TouchableOpacity
        style={{
          backgroundColor: "#4F8BFF",
          padding: 12,
          borderRadius: 8,
          width: 320,
          height: 44,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
          가입하기
        </Text>
      </TouchableOpacity>
    </>
  );
};

export default MyButton;
