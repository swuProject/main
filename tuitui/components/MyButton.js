import React from "react";
import { TouchableOpacity, Text } from "react-native";

const MyButton = () => {
    return (
        <TouchableOpacity
            style={{ 
            backgroundColor: '#4F8BFF',
            padding: 12,
            marginBottom: 40,
            borderRadius: 8,
            width: 320,
            height: 44,
            alignItems: "center",
            }}
            onPress={() => alert('회원이 아닙니다.')}
        >
            <Text style={{ color: 'white', fontSize: 14, fontWeight: "bold"}}>로그인</Text>
        </TouchableOpacity>
    );
};

export default MyButton;