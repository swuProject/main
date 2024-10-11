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
    const fetchMessages = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const response = await fetch(
          `https://tuituiworld.store:8444/api/chat/rooms/${chatRoomId}/messages?pageNo=0&pageSize=100&sortBy=createdAt`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
    
        if (response.ok) {
          const savedMessages = await response.json();
          if (savedMessages && savedMessages.data && savedMessages.data.contents) {
            setChatMessages(savedMessages.data.contents); // 데이터 구조에 맞게 수정
          } else {
            console.error('메시지 데이터가 없습니다.');
          }
        } else {
          console.log('메시지를 불러오지 못했습니다:', response.status);
        }
      } catch (error) {
        console.error('API 요청 중 오류 발생:', error);
      }
    };
  
    fetchMessages(); 
  }, [chatRoomId]);  

  useEffect(() => {
    // WebSocket 클라이언트 설정
    const stompClient = new Client({
      webSocketFactory: () => new SockJS('https://tuituiworld.store:8444/ws-stomp'),
      debug: (str) => {
        //console.log(str);
      },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Connected');
        //console.log(`Current chatRoomId: ${chatRoomId}`);
        stompClient.subscribe(`/sub/chat/room/${chatRoomId}`, (message) => {
          if (message.isBinaryBody) {
            try {
              const binaryArray = Object.values(message._binaryBody);
              const decoder = new TextDecoder('utf-8');
              const jsonString = decoder.decode(new Uint8Array(binaryArray));
              if (jsonString) {
                const receivedMessage = JSON.parse(jsonString);
                setChatMessages((prevMessages) => [receivedMessage, ...prevMessages]);
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
        senderProfileId: profileId,
        receiverProfileId: guestProfileId,
        roomId: chatRoomId,
        messageType: 'CHAT',
      };

      client.publish({
        destination: `/pub/chat/message`,
        body: JSON.stringify(chatMessage),
      });

      setMessage(''); // 입력 필드 초기화
    }
  };

  const renderMessageItem = ({ item }) => {
    const isSender = item.senderProfileId == profileId; // 현재 사용자와 메시지 발신자 비교

    // 로컬 타임스탬프 생성 (예: 현재 시간)
    const localTimestamp = new Date().toLocaleTimeString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

    return (
        <View style={[
            styles.messageContainer,
            isSender ? styles.messageSender : styles.messageReceiver // 발신자/수신자 스타일 결정
        ]}>
            <View>
                {/* item.message가 존재할 때 */}
                {item.message ? (
                    <>
                        <Text style={styles.message}>{item.message}</Text>
                        <Text style={styles.timestamp}>
                            {new Date(item.createdAt).toLocaleTimeString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </>
                ) : (
                    // item.content가 존재할 때
                    item.content && (
                        <>
                            <Text style={styles.message}>{item.content}</Text>
                            <Text style={styles.timestamp}>{localTimestamp}</Text>
                        </>
                    )
                )}
            </View>
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
        keyExtractor={(item) => item.chatContentId}
        style={styles.chatContent}
        inverted
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
  timestamp: {
    fontSize: 10,
    color: 'white',
    textAlign: 'right', // 오른쪽 정렬
},
});

export default ChatroomScreen;
