import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import 'react-native-gesture-handler';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

function Registerscreen({navigation: {navigate}}) {
  return (
    <View style={styles.container}>
      <View style={{flex: 1}} />
      <View style={{flex: 3}}>
        <View>
          <Text>이름</Text>
          <TextInput 
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.inputBox}
                />
        </View>
        <View>
          <Text>아이디</Text>
          <TextInput 
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.inputBox}
                />
        </View>
        <View>
          <Text>비밀번호</Text>
          <TextInput 
                    keyboardType="email-address"
                    secureTextEntry = {true}
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.inputBox}
                />
        </View>
        <View>
          <Text>비밀번호 확인</Text>
          <TextInput 
                    keyboardType="email-address"
                    secureTextEntry = {true}
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.inputBox}
                />
        </View>
        <View>
          <Text>휴대전화 번호인증</Text>
          <TextInput 
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.inputBox}
                />
        </View>
        <View>
          <Text>인증번호</Text>
          <TextInput 
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.inputBox}
                />
        </View>
      </View>
      <View>
        <TouchableOpacity>
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 15}}>가입하기</Text>
        </TouchableOpacity>
      </View>
      <View style={{flex: 1}} />
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
    marginBottom: hp(1)
  },
  btnArea: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(1)
  },
  registerArea: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(3),
    marginBottom: hp(6)
  },
  logoText: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 80,
    letterSpacing: 20,
  },
  btnBlue: {
    width: wp(80),
    height: hp(6),
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4F8BFF',
  },
  btnKakao: {
    width: wp(80),
    height: hp(6),
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEE500',
  },
  btnNaver: {
    width: wp(80),
    height: hp(6),
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#03C75A',
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
});

export default Registerscreen;