import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ChatScreen = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const chat_url = "https://tuituiworld.store:8444";
  const base_url = "https://tuituiworld.store:8443";

  // 채팅방 목록 가져오는 함수
  const fetchChatRooms = async () => {
    try {
      const profileId = await AsyncStorage.getItem('profileId');
      const accessToken = await AsyncStorage.getItem('accessToken');
  
      if (!profileId || !accessToken) {
        console.error('프로필 ID 또는 액세스 토큰을 찾을 수 없습니다.');
        return;
      }
  
      const response = await fetch(`${chat_url}/api/chat/rooms/${profileId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const data = await response.json();
      
      // 응답 상태 확인
      if (!response.ok) {
        console.log('서버 오류:', data.message);
        return;
      }
  
      // 데이터가 존재하는지 확인 후 reverse() 호출
      if (data.data) {
        console.log('채팅방 목록', data.data);
        setChatRooms(data.data.reverse());
      } else {
        console.log('채팅방 목록이 비어 있습니다.');
        setChatRooms([]); // 빈 배열로 설정
      }
    } catch (error) {
      console.log('채팅방 목록을 가져오는 중 오류가 발생했습니다.', error);
    } 
  };  

  useEffect(() => {
    // 컴포넌트가 마운트될 때 채팅방 목록을 가져옵니다.
    fetchChatRooms();
  }, []);

  // 유저 검색 API 호출
  const searchUsers = async (query) => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await fetch(`${base_url}/api/profiles/nicknames/${query}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.log(`서버 오류: ${errorData.message || response.statusText}`);
        return;
      }
  
      const responseData = await response.json();
      console.log(responseData); 
  
      if (responseData.status === "OK") {
        setSearchResults([responseData.data]); 
      } else {
        console.log('서버로부터 빈 응답을 받았습니다.');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('유저 검색 중 오류 발생:', error);
    }
  };  

  // 채팅방 생성 API 호출
  const createChatRoom = async (guestProfileId) => {
    try {
      const hostProfileId = await AsyncStorage.getItem('profileId');
      const accessToken = await AsyncStorage.getItem('accessToken');

      console.log(hostProfileId, guestProfileId);

      const response = await fetch(`${chat_url}/api/chat/rooms`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hostProfileId,
          guestProfileId,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('채팅방이 성공적으로 생성되었습니다.', data);
        // 채팅방 목록을 업데이트
        fetchChatRooms(); // fetchChatRooms를 호출
      } else {
        console.log('채팅방 생성 실패:', data.message);
      }
    } catch (error) {
      console.error('채팅방 생성 중 오류 발생:', error);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setSearchResults([]);
      return;
    }
    searchUsers(text);
  };
  
  const renderUser = ({ item }) => (
    <TouchableOpacity style={styles.userItem} onPress={() => createChatRoom(item.profileId)}>
      <Image source={{ uri: item.profileImgPath }} style={styles.avatar} />
      <View>
        <Text style={styles.nickname}>{item.nickname}</Text>
        <Text style={styles.username}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderChatRoom = ({ item }) => (
    <TouchableOpacity style={styles.chatRoom} onPress={() => navigation.navigate('ChatroomScreen', { chatRoomId: item.guestProfileNickname, chatRoomImage: item.guestProfileImage })}>
      <Image source={{ uri: item.guestProfileImage }} style={styles.avatar} />
      <Text style={styles.chatRoomName}>{item.guestProfileNickname} 님과의 대화</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="유저 닉네임을 검색하세요."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <Icon name="search" size={24} color="gray" style={styles.searchIcon} />
      </View>

      {searchQuery ? (
        <FlatList
          data={searchResults}
          renderItem={renderUser}
          contentContainerStyle={styles.list}
        />
      ) : (
        <FlatList
          data={chatRooms}
          renderItem={renderChatRoom}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  searchIcon: {
    position: 'absolute',
    right: 20,
  },
  list: {
    marginTop: 20,
  },
  chatRoom: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  chatRoomName: {
    fontSize: 16,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  nickname: {
    fontSize: 14,
    fontWeight: "bold",
  },
  username: {
    fontSize: 12,
    color: "#555",
  },
});

export default ChatScreen;
