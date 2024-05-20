import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';

function Loginscreen({navigation}) {
  return (
    <View style={styles.container}>
        <View style={{flex: 1}} />
        <View style={{flex: 3}}>
            <View style={styles.logoArea}>
                <Text style={styles.logoText}>
                    TuiTui
                </Text>
            </View>
            <View style={styles.inputArea}>
                <TextInput 
                    placeholder= "E-mail"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.inputBox}
                />
                <TextInput 
                    placeholder="Password"
                    keyboardType="email-address"
                    secureTextEntry = {true}
                    textContentType='oneTimeCode'
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.inputBox}
                />
            </View>
            <View style={styles.btnArea}>
                <TouchableOpacity style={styles.btnBlue}>
                    <Text style={{color: 'white', fontWeight: 'bold', fontSize: 15}}>로그인</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.registerArea}>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={{color: '#5B93FF', fontWeight: 'bold' , marginBottom: hp(1)}}>회원가입</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={{color: '#5B93FF', fontWeight: 'bold' }}>아이디/비밀번호 찾기</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.btnArea}>
                <TouchableOpacity style={styles.btnKakao}>
                    <Text style={{color: 'black', fontWeight: 'bold', fontSize: 15}}>카카오로 시작하기</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.btnArea}>
                <TouchableOpacity style={styles.btnNaver}>
                    <Text style={{color: 'white', fontWeight: 'bold', fontSize: 15}}>네이버로 시작하기</Text>
                </TouchableOpacity>
            </View>
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
  logoArea: {
    marginTop: hp(-10),
    marginBottom: hp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputArea: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2)
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

export default Loginscreen;