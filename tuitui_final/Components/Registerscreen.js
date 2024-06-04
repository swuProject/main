import React, { useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import 'react-native-gesture-handler';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

function Registerscreen({ navigation: { navigate } }) {
  const [name, setName] = useState('');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const user = {
      name,
      account,
      password,
      phone,
    };

    try {
      const response = await fetch('http://13.124.69.147:8080/api/user/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const result = await response.json();

      if (response.ok) {
        alert('환영합니다');
        navigate('Login'); // Replace with your login screen
      } else {
        alert(`회원가입 실패: ${result.message}`);
      }
    } catch (error) {
      alert(`An error occurred: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 0.3 }}></View>
      <View style={styles.inputArea}>
        <Text style={{ marginRight: wp(70), marginBottom: hp(1) }}>이름</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.inputBox}
        />
      </View>
      <View style={styles.inputArea}>
        <Text style={{ marginRight: wp(67), marginBottom: hp(1) }}>이메일</Text>
        <TextInput
          value={account}
          onChangeText={setAccount}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.inputBox}
        />
      </View>
      <View style={styles.inputArea}>
        <Text style={{ marginRight: wp(64), marginBottom: hp(1) }}>비밀번호</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          textContentType='oneTimeCode'
          style={styles.inputBox}
        />
      </View>
      <View style={styles.inputArea}>
        <Text style={{ marginRight: wp(58), marginBottom: hp(1) }}>비밀번호 확인</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
          textContentType='oneTimeCode'
          style={styles.inputBox}
        />
      </View>
      <View style={styles.inputArea}>
        <Text style={{ marginRight: wp(52), marginBottom: hp(1) }}>휴대전화 번호인증</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={styles.inputBox}
        />
      </View>
      <View style={styles.inputArea}>
        <Text style={{ marginRight: wp(64), marginBottom: hp(1) }}>인증번호</Text>
        <TextInput
          autoCorrect={false}
          keyboardType="numeric"
          style={styles.inputBox}
        />
      </View>
      <View style={{ alignItems: 'center', marginTop: hp(2) }}>
        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.textStyle}>가입하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderColor: 'lightgray',
    marginBottom: hp(1),
    paddingHorizontal: wp(3),
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default Registerscreen;
