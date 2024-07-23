import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const RegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '',
    account: '',
    password: '',
    confirmPassword: '',
    phone: '',
    nickname: '',
    describeSelf: '',
    gender: 'N',
    birthDate: new Date(),
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleInputChange = (key, value) => {
    setForm(prevForm => ({ ...prevForm, [key]: value }));
  };

  const handleRegister = async () => {
    const { name, account, password, confirmPassword, phone, nickname, describeSelf, gender, birthDate } = form;
  
    if (!name || !account || !password || !confirmPassword || !phone) {
      Alert.alert('모든 필드를 입력해주세요.');
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert('비밀번호가 일치하지 않습니다.');
      return;
    }
  
    if (!/\S+@\S+\.\S+/.test(account)) {
      Alert.alert('올바른 이메일 형식을 입력해주세요.');
      return;
    }
  
    const user = { name, account, password, phone };
  
    try {
      // 사용자 정보 요청
      const userResponse = await fetch('http://13.124.69.147:8080/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
  
      console.log('User Response Status:', userResponse.status);
      const userData = await userResponse.json();
      console.log('User Response Data:', userData);
  
      if (!userResponse.ok) {
        const errorMessage = userData && userData.message
          ? userData.message
          : '회원가입 실패: 알 수 없는 오류가 발생했습니다.';
  
        Alert.alert('오류', errorMessage);
        return;
      }
  
      const userId = userData.data.userId;
  
      // 프로필 정보 요청
      const profileData = {
        userId: userId,
        nickname: form.nickname,
        describeSelf: form.describeSelf,
        gender: form.gender,
        birth: moment(form.birthDate).format('YYYY-MM-DD'),
      };
  
      const profileResponse = await fetch('http://13.124.69.147:8080/api/profiles/without-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData), // JSON 본문을 직접 전송
      });
  
      console.log('Profile Response Status:', profileResponse.status);
      const profileResult = await profileResponse.json();
      console.log('Profile Response Data:', profileResult);
  
      if (!profileResponse.ok) {
        const errorMessage = profileResult && profileResult.error
          ? profileResult.error
          : '프로필 등록 실패: 알 수 없는 오류가 발생했습니다.';
  
        Alert.alert('오류', errorMessage);
        return;
      }
  
      Alert.alert('회원가입 및 프로필 등록 성공!');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('오류 발생', `오류 발생: ${error.message || '알 수 없는 오류가 발생했습니다.'}`);
    }
  };
    

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || form.birthDate;
    setShowDatePicker(false);
    handleInputChange('birthDate', currentDate);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inputArea}>
        <Text style={styles.label}>이름</Text>
        <TextInput
          value={form.name}
          onChangeText={(value) => handleInputChange('name', value)}
          autoCapitalize="none"
          style={styles.inputBox}
        />
      </View>
      <View style={styles.inputArea}>
        <Text style={styles.label}>이메일</Text>
        <TextInput
          value={form.account}
          onChangeText={(value) => handleInputChange('account', value)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.inputBox}
        />
      </View>
      <View style={styles.inputArea}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          value={form.password}
          onChangeText={(value) => handleInputChange('password', value)}
          secureTextEntry
          textContentType="oneTimeCode"
          autoCapitalize="none"
          style={styles.inputBox}
        />
      </View>
      <View style={styles.inputArea}>
        <Text style={styles.label}>비밀번호 확인</Text>
        <TextInput
          value={form.confirmPassword}
          onChangeText={(value) => handleInputChange('confirmPassword', value)}
          secureTextEntry
          textContentType="oneTimeCode"
          autoCapitalize="none"
          style={styles.inputBox}
        />
      </View>
      <View style={styles.inputArea}>
        <Text style={styles.label}>휴대전화 번호</Text>
        <TextInput
          value={form.phone}
          onChangeText={(value) => handleInputChange('phone', value)}
          keyboardType="phone-pad"
          style={styles.inputBox}
        />
      </View>
      <View style={styles.inputArea}>
        <Text style={styles.label}>닉네임</Text>
        <TextInput
          value={form.nickname}
          onChangeText={(value) => handleInputChange('nickname', value)}
          autoCapitalize="none"
          style={styles.inputBox}
        />
      </View>
      <View style={styles.inputArea}>
        <Text style={styles.label}>자기 소개</Text>
        <TextInput
          value={form.describeSelf}
          onChangeText={(value) => handleInputChange('describeSelf', value)}
          style={styles.inputBox}
        />
      </View>
      <View style={styles.inputArea}>
        <Text style={styles.label}>성별</Text>
        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[styles.genderButton, form.gender === 'M' && styles.selectedGender]}
            onPress={() => handleInputChange('gender', 'M')}
          >
            <Text style={styles.genderText}>남성</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.genderButton, form.gender === 'F' && styles.selectedGender]}
            onPress={() => handleInputChange('gender', 'F')}
          >
            <Text style={styles.genderText}>여성</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.inputArea}>
        <Text style={styles.label}>생년월일</Text>
        <TouchableOpacity onPress={showDatePickerModal} style={styles.inputBox}>
          <Text>{moment(form.birthDate).format('YYYY-MM-DD')}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={form.birthDate}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
          />
        )}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>가입하기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    padding: wp(5),
  },
  inputArea: {
    marginBottom: hp(2),
  },
  label: {
    marginBottom: hp(1),
    fontSize: 15,
    fontWeight: 'bold',
  },
  inputBox: {
    width: '100%',
    height: hp(6),
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: 'lightgray',
    paddingHorizontal: wp(3),
    justifyContent: 'center',
  },
  button: {
    marginTop: hp(2),
    marginBottom: hp(4),
    backgroundColor: '#4F8BFF',
    paddingVertical: hp(2),
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(1),
  },
  genderButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 8,
    paddingVertical: hp(2),
    alignItems: 'center',
  },
  selectedGender: {
    backgroundColor: '#4F8BFF',
    
  },
  genderText: {
    fontSize: 15,
  },
});

export default RegisterScreen;
