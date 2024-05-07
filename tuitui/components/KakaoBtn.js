import React from "react";
import { TouchableOpacity, Text } from "react-native";

const KakaoBtn = () => {
    return (
        <TouchableOpacity
            style={{ 
            backgroundColor: '#FEE500',
            padding: 12,
            marginBottom: 20,
            borderRadius: 8,
            width: 320,
            height: 44,
            alignItems: "center",
            }}
        >
            <Text style={{ color: '#000000', fontSize: 14, fontWeight: "bold"}}>카카오로 시작하기</Text>
        </TouchableOpacity>
    );
};

export default KakaoBtn;