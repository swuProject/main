import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import MyButton from './MyButton';
import EmailTextbox from './EmailTextbox';
import PasswordTextbox from './PasswordTextbox';
import KakaoBtn from './KakaoBtn';
import NaverBtn from './NaverBtn';

const Logo = () => {
  return (
    <View style={{flex:1, alignItems: 'center', justifyContent: 'center', }}>
      <Text style={{fontSize:80, marginBottom: 40}}>
        TuiTui
      </Text>
      <EmailTextbox />
      <PasswordTextbox />
      <TouchableOpacity>
        <Text style={{fontSize:12, marginBottom:10, marginTop:10, color: '#5B93FF', textDecorationLine: 'underline', }}>
        아이디/비밀번호 찾기
        </Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={{fontSize:12, marginBottom:30, marginTop:10, color: '#5B93FF', textDecorationLine: 'underline', }}>
        회원가입
        </Text>
      </TouchableOpacity>
      <MyButton/>
      <KakaoBtn/>
      <NaverBtn/>
    </View>
  );
};

export default Logo;