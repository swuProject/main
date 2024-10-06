import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Image, Text } from 'react-native';

const ChatroomScreen = ({ route, navigation }) => {
  const { chatRoomId, chatRoomImage } = route.params;
  const [message, setMessage] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerContainer}>
          <Image source={{ uri: chatRoomImage }} style={styles.headerImage} />
          <Text style={styles.headerTitle}>{chatRoomId}</Text>
        </View>
      ),
    });
  }, [chatRoomId, chatRoomImage, navigation]);

  const handleSendMessage = () => {
    // 메시지 전송 로직 추가
    console.log(`메시지 전송: ${message}`);
    setMessage(''); // 입력 필드 초기화
  };

  return (
    <View style={styles.container}>
      {/* 채팅 내용을 표시하는 컴포넌트 추가 */}
      <View style={styles.chatContent}>
        {/* 채팅 메시지 표시 영역을 여기에 추가할 수 있습니다. */}
      </View>

      {/* 메시지 입력 칸 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="메시지를 입력하세요."
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={handleSendMessage}
          returnKeyType="send"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  chatContent: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    padding: 8,
    paddingLeft: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChatroomScreen;
