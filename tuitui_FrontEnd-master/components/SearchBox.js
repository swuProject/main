import React from "react";
import { TextInput } from "react-native";

const SearchBox = () => {
    return (
        <TextInput 
            placeholder="채팅방 또는 사람 검색"
            autoCapitalize="none"
            autoCorrect={false}
            style={{
            paddingHorizontal: 16,
            height: 44, 
            width: 320, 
            borderWidth: 0.5, 
            borderRadius: 20, 
            borderColor: 30, 
            }}>
        </TextInput>
    );
};

export default SearchBox;