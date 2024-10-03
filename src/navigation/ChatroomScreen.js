import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, FlatList } from 'react-native';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const ChatroomScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [client, setClient] = useState(null);

  useEffect(() => {
    // SockJS를 사용하여 STOMP 클라이언트 생성
    const socket = new SockJS('http://your-server-url/sockjs');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),  // 디버깅 정보 출력
      reconnectDelay: 5000,  // 재연결 딜레이
    });

    // 연결 성공 시 실행
    stompClient.onConnect = (frame) => {
      console.log('Connected: ' + frame);

      // 서버에서 메시지 수신
      stompClient.subscribe('/topic/messages', (messageOutput) => {
        const newMessage = JSON.parse(messageOutput.body);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    };

    // 연결 시도
    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();  // 컴포넌트가 언마운트 될 때 연결 해제
    };
  }, []);

  // 메시지 전송
  const sendMessage = () => {
    if (client && client.connected && message) {
      const newMessage = { text: message, sender: 'user' };
      client.publish({
        destination: '/app/chat',  // 서버에서 처리할 엔드포인트
        body: JSON.stringify(newMessage),
      });
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
    }
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <Text>{item.sender}: {item.text}</Text>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Enter your message"
        style={{ borderWidth: 1, padding: 10 }}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};

export default ChatScreen;
