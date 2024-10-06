import React, { useEffect, useState, useRef, } from 'react';
import { View, StyleSheet, TextInput, Image, Text, FlatList, TouchableOpacity, } from 'react-native';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatroomScreen = ({ route, navigation }) => {
  const { chatRoomId, chatRoomName, chatRoomImage, guestProfileId } = route.params;
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [client, setClient] = useState(null);
  const [profileId, setProfileId] = useState(null);

  const flatListRef = useRef(null);

  useEffect(() => {
    // AsyncStorage에서 사용자 ID 가져오기
    const fetchProfileId = async () => {
      const storedProfileId = await AsyncStorage.getItem('profileId');
      setProfileId(storedProfileId);
    };
    fetchProfileId();
    
    // 헤더 설정
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerContainer}>
          <Image source={{ uri: chatRoomImage }} style={styles.headerImage} />
          <Text style={styles.headerTitle}>{chatRoomName}</Text>
        </View>
      ),
    });
  }, [chatRoomName, chatRoomImage, navigation]);

  useEffect(() => {
    // WebSocket 클라이언트 설정
    const stompClient = new Client({
      webSocketFactory: () => new SockJS('https://tuituiworld.store:8444/ws-stomp'),
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Connected');
        console.log(`Current chatRoomId: ${chatRoomId}`);
        stompClient.subscribe(`/sub/chat/room/${chatRoomId}`, (message) => {
          if (message.isBinaryBody) {
            try {
              const binaryArray = Object.values(message._binaryBody);
              const decoder = new TextDecoder('utf-8');
              const jsonString = decoder.decode(new Uint8Array(binaryArray));
              if (jsonString) {
                const receivedMessage = JSON.parse(jsonString);
                setChatMessages((prevMessages) => [...prevMessages, receivedMessage]);
              }
            } catch (error) {
              console.error('오류:', error);
            }
          }
        });
      },
      onDisconnect: () => {
        console.log('Disconnected');
      },
    });

    stompClient.activate();
    setClient(stompClient);

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      stompClient.deactivate();
    };
  }, [chatRoomId]);

  const handleSendMessage = () => {
    if (client && message.trim() && profileId) {
      const chatMessage = {
        content: message,
        senderProfileId: profileId,  // 실제 사용자 정보를 여기에 넣음
        receiverProfileId: guestProfileId,
        roomId: chatRoomId,
      };

      client.publish({
        destination: `/pub/chat/message`,
        body: JSON.stringify(chatMessage),
      });

      setMessage(''); // 입력 필드 초기화
    }
  };

  useEffect(() => {
    // 새로운 메시지가 추가될 때마다 FlatList를 아래로 스크롤합니다.
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [chatMessages]); // chatMessages가 변경될 때마다 실행

  const renderMessageItem = ({ item }) => {
    const isSender = item.senderProfileId == profileId; // 현재 사용자와 메시지 발신자 비교
  
    return (
      <View style={[
        styles.messageContainer,
        isSender ? styles.messageSender : styles.messageReceiver // 발신자/수신자 스타일 결정
      ]}>
        <Text style={styles.message}>{item.content}</Text>
      </View>
    );
  };  

  return (
    <View style={styles.container}>
      {/* 채팅 내용을 표시하는 FlatList */}
      <FlatList
        ref={flatListRef}
        data={chatMessages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        style={styles.chatContent}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="메시지를 입력하세요."
          value={message}
          onChangeText={setMessage}
          returnKeyType="default"
          multiline
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>전송</Text>
        </TouchableOpacity>
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
    marginBottom: 10,
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
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
  messageContainer: {
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '80%',
    backgroundColor: '#8a8a8a', 
  },
  messageSender: {
    backgroundColor: '#8a8a8a', // 발신자 메시지 색상
    alignSelf: 'flex-end', // 발신자 메시지 위치
  },
  messageReceiver: {
    backgroundColor: '#8a8a8a', // 수신자 메시지 색상
    alignSelf: 'flex-start', // 수신자 메시지 위치
  },
  message: {
    marginTop: 5,
    color: '#fff', // 메시지 글자 색상
  },
  sendButton: {
    position: 'absolute', // 절대 위치 설정
    right: 4, // 오른쪽 끝에 위치
    bottom: 4,
    backgroundColor: '#000',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatroomScreen;
