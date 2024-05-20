import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import 'react-native-gesture-handler';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

function Registerscreen({navigation: {navigate}}) {
  return (
    <View style={styles.container}>
      <View style={{flex:0.3}}></View>
        <View style={styles.inputArea}>
          <Text style={{marginRight: wp(70), marginBottom: hp(1)}}>이름</Text>
          <TextInput 
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.inputBox}
                />
        </View>
        <View style={styles.inputArea}>
          <Text style={{marginRight: wp(67), marginBottom: hp(1)}}>아이디</Text>
          <TextInput 
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.inputBox}
                />
        </View>
        <View style={styles.inputArea}>
          <Text style={{marginRight: wp(64), marginBottom: hp(1)}}>비밀번호</Text>
          <TextInput 
                    keyboardType="email-address"
                    secureTextEntry = {true}
                    textContentType='oneTimeCode'
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.inputBox}
                />
        </View>
        <View style={styles.inputArea}>
          <Text style={{marginRight: wp(58), marginBottom: hp(1)}}>비밀번호 확인</Text>
          <TextInput 
                    keyboardType="email-address"
                    secureTextEntry = {true}
                    textContentType='oneTimeCode'
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.inputBox}
                />
        </View>
        <View style={styles.inputArea}>
          <Text style={{marginRight: wp(52), marginBottom: hp(1)}}>휴대전화 번호인증</Text>
          <TextInput 
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.inputBox}
                />
        </View>
        <View style={styles.inputArea}>
          <Text style={{marginRight: wp(64), marginBottom: hp(1),}}>인증번호</Text>
          <TextInput 
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.inputBox}
                />
        </View>
      <View style={{alignItems: 'center', marginTop: hp(2)}}>
        <TouchableOpacity>
          <Text style={styles.textStyle}>가입하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, //전체의 공간을 차지한다는 의미
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  inputArea: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  inputBox: {
    width: wp(80),
    height: hp(6),
    justifyContent: 'center',
    alignItems: 'center', 
    borderWidth: 0.5, 
    borderRadius: 8, 
    borderColor: 30,
    marginBottom: hp(1),
    paddingHorizontal: wp(3)
  },
  textStyle: {
    color: 'black', 
    fontWeight: 'bold', 
    fontSize: 18
  }
});

export default Registerscreen;