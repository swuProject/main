import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";

export default function FindScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const SERVER_URL = "https://tuituiworld.store/api/profiles/nicknames/";

  /**
   * 검색어가 변경될 때마다 호출되는 함수
   * @param {string} query - 사용자가 입력한 검색어
   */
  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (query.length === 0) {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      // AsyncStorage에서 accessToken 불러오기
      const accessToken = await AsyncStorage.getItem("accessToken");
      if (!accessToken) {
        Alert.alert("인증 오류", "로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      // API 호출
      const response = await fetch(
        `${SERVER_URL}${encodeURIComponent(query)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        setUsers([data.data]); // 단일 유저 프로필을 배열로 감싸서 FlatList에 전달
      } else if (response.status === 404) {
        setUsers([]);
      } else if (response.status === 500) {
        Alert.alert(
          "서버 오류",
          "서버에서 요청을 처리할 수 없습니다. 나중에 다시 시도해주세요."
        );
      } else {
        Alert.alert("오류", "알 수 없는 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("네트워크 오류", "인터넷 연결 상태를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 검색 버튼을 눌렀을 때 호출되는 함수
   */
  const handleSearchSubmit = () => {
    handleSearch(searchQuery);
  };

  /**
   * FlatList의 각 아이템을 렌더링하는 함수
   * @param {object} param0 - FlatList의 renderItem 파라미터
   */
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.userItem}
        onPress={() =>
          navigation.navigate("Profileinfo", { nickname: item.nickname })
        }
      >
        <Image source={{ uri: item.profileImgPath }} style={styles.avatar} />
        <View>
          <Text style={styles.nickname}>{item.nickname}</Text>
          <Text style={styles.username}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="유저 닉네임을 검색하세요"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearchSubmit}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        <Icon name="search" size={24} color="gray" style={styles.searchIcon} />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) =>
            item.id ? item.id.toString() : item.nickname
          }
          renderItem={renderItem}
          ListEmptyComponent={() =>
            searchQuery.length > 0 && !loading ? (
              <Text style={styles.noResults}>검색 결과가 없습니다.</Text>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5, // 줄어든 패딩
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  avatar: {
    width: 40, // 줄어든 너비
    height: 40, // 줄어든 높이
    borderRadius: 20, // 줄어든 반지름
    marginRight: 10, // 줄어든 마진
  },
  nickname: {
    fontSize: 14, // 줄어든 폰트 크기
    fontWeight: "bold",
  },
  username: {
    fontSize: 12, // 줄어든 폰트 크기
    color: "#555",
  },
  noResults: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
  loader: {
    marginTop: 20,
  },
  searchIcon: {
    position: "absolute",
    right: 10,
  },
});
