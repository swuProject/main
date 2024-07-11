import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const Registerscreen = ({ navigation }) => {
  // 상태 변수들
  const [name, setName] = useState(''); // 이름
  const [account, setAccount] = useState(''); // 이메일
  const [password, setPassword] = useState(''); // 비밀번호
  const [confirmPassword, setConfirmPassword] = useState(''); // 비밀번호 확인
  const [phone, setPhone] = useState(''); // 휴대전화 번호
  const [nickname, setNickname] = useState(''); // 닉네임
  const [describeSelf, setDescribeSelf] = useState(''); // 자기 소개
  const [gender, setGender] = useState(''); // 성별
  const [birthDate, setBirthDate] = useState(new Date()); // 생년월일
  const [showDatePicker, setShowDatePicker] = useState(false); // DatePicker 보이기 여부

  // 회원가입 처리 함수
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 회원가입 정보
    const user = {
      name,
      account,
      password,
      phone,
    };

    try {
      const userResponse = await fetch('http://13.124.69.147:8080/api/user/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const userResult = await userResponse.json();

      if (!userResponse.ok) {
        throw new Error(`회원가입 실패: ${userResult.message}`);
      }

      // 프로필 정보
      const profile = {
        nickname,
        describeSelf,
        gender,
        birth: moment(birthDate).format('YYYY-MM-DD'),
        // profileImgPath: profileImage ? profileImage.uri : '', // 프로필 이미지가 있으면 경로를 설정(공부중)
      };

      const profileResponse = await fetch('http://13.124.69.147:8080/api/profile/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      const profileResult = await profileResponse.json();

      if (profileResponse.ok) {
        Alert.alert('회원가입 및 프로필 등록 성공!');
        navigation.navigate('Login'); // 로그인 화면으로 이동
      } else {
        Alert.alert(`프로필 등록 실패: ${profileResult.message}`);
      }
    } catch (error) {
      Alert.alert(`오류 발생: ${error.message}`);
    }
  };

  // DatePicker 모달 보이기
  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  // DatePicker 값 변경 처리
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthDate;
    setShowDatePicker(false);
    setBirthDate(currentDate);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 이름 입력란 */}
      <View style={styles.inputArea}>
        <Text style={styles.label}>이름</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.inputBox}
        />
      </View>
      {/* 이메일 입력란 */}
      <View style={styles.inputArea}>
        <Text style={styles.label}>이메일</Text>
        <TextInput
          value={account}
          onChangeText={setAccount}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.inputBox}
        />
      </View>
      {/* 비밀번호 입력란 */}
      <View style={styles.inputArea}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="oneTimeCode" // 자동완성 방지를 위해 oneTimeCode 사용
          style={styles.inputBox}
        />
      </View>
      {/* 비밀번호 확인 입력란 */}
      <View style={styles.inputArea}>
        <Text style={styles.label}>비밀번호 확인</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          textContentType="oneTimeCode" // 자동완성 방지를 위해 oneTimeCode 사용
          style={styles.inputBox}
        />
      </View>
      {/* 휴대전화 번호 입력란 */}
      <View style={styles.inputArea}>
        <Text style={styles.label}>휴대전화 번호</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={styles.inputBox}
        />
      </View>
      {/* 닉네임 입력란 */}
      <View style={styles.inputArea}>
        <Text style={styles.label}>닉네임</Text>
        <TextInput
          value={nickname}
          onChangeText={setNickname}
          style={styles.inputBox}
        />
      </View>
      {/* 자기 소개 입력란 */}
      <View style={styles.inputArea}>
        <Text style={styles.label}>자기 소개</Text>
        <TextInput
          value={describeSelf}
          onChangeText={setDescribeSelf}
          style={[styles.inputBox]}
        />
      </View>
      {/* 성별 선택 */}
      <View style={styles.inputArea}>
        <Text style={styles.label}>성별</Text>
        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[styles.genderButton, gender === 'M' && styles.selectedGender]}
            onPress={() => setGender('M')}
          >
            <Text style={styles.genderText}>남성</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.genderButton, gender === 'F' && styles.selectedGender]}
            onPress={() => setGender('F')}
          >
            <Text style={styles.genderText}>여성</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* 생년월일 선택 */}
      <View style={styles.inputArea}>
        <Text style={styles.label}>생년월일</Text>
        <TouchableOpacity onPress={showDatePickerModal} style={styles.inputBox}>
          <Text>{moment(birthDate).format('YYYY-MM-DD')}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={birthDate}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
          />
        )}
      </View>
      {/* 가입하기 버튼 */}
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
    fontSize: 16,
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
    backgroundColor: 'blue',
    paddingVertical: hp(1.5),
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
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
    paddingVertical: hp(1),
    alignItems: 'center',
  },
  selectedGender: {
    backgroundColor: 'lightblue',
  },
  genderText: {
    fontSize: 16,
  },
});

export default Registerscreen;
