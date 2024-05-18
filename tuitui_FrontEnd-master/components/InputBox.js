import React from "react";
import { TextInput } from "react-native";

const InputBox = () => {
    return (
        <TextInput 
            autoCapitalize="none"
            autoCorrect={false}
            style={{
            marginBottom: 10,
            paddingHorizontal: 10,
            height: 44, 
            width: 320, 
            borderWidth: 0.5, 
            borderRadius: 5, 
            borderColor: 30, 
            }}>
        </TextInput>
    );
};

export default InputBox;