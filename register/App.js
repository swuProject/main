import * as React from "react";
import { TouchableOpacity, Text, View, Image } from 'react-native';
import MyButton from "./components/MyButton";
import InputBox from "./components/InputBox";
import SecureInput from "./components/SecureInput";
import back from './assets/back.png';

export default function App() {
  return (
    <View style={{ padding: '10%', marginTop: 40 }}>

      <View style={{flexDirection: "row", }}>
        <TouchableOpacity>
          <Image style={{}} source={back}/>
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginLeft: '30%'}}>회원가입</Text>
      </View>

      <View style= {{marginTop: 40}}>
        <View>
          <Text style={{marginBottom: 8}}>이름</Text>
          <InputBox/>
        </View>
        <View style={{marginTop: 20}}>
          <Text style={{marginBottom: 8}}>아이디</Text>
          <InputBox/>
        </View>
        <View style={{marginTop: 20}}>
          <Text style={{marginBottom: 8}}>비밀번호</Text>
          <SecureInput/>
        </View>
        <View style={{marginTop: 20}}>
          <Text style={{marginBottom: 8}}>비밀번호 확인</Text>
          <SecureInput/>
        </View>
        <View style={{marginTop: 20}}>
          <Text style={{marginBottom: 8}}>휴대전화 번호인증</Text>
          <InputBox/>
        </View>
        <View style={{marginTop: 20}}>
          <Text style={{marginBottom: 8}}>인증번호</Text>
          <InputBox/>
        </View>
      </View>

      <View style={{marginTop: 40}}>
        <MyButton/>
      </View>

    </View>
  );
};
