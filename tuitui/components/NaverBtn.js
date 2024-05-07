import React from "react";
import { TouchableOpacity, Text } from "react-native";

const NaverBtn = () => {
    return (
        <TouchableOpacity
            style={{ 
            backgroundColor: '#03C75A',
            padding: 12,
            marginBottom: 20,
            borderRadius: 8,
            width: 320,
            height: 44,
            alignItems: "center",
            }}
        >
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: "bold"}}>네이버로 시작하기</Text>
        </TouchableOpacity>
    );
};

export default NaverBtn;