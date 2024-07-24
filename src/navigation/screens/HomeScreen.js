import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

// page와 limit 사용해서 데이터 타임캡슐 데이터 가져옴.
const GetCapsule = async (page, limit) => {
  try {
    const response = await fetch(
      `http://13.124.69.147:8080/api/capsules/test?page=${page}&limit=${limit}`
    );
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching capsules:", error);
    return [];
  }
};

const GetProfileImgPath = async () => {
  try {
    const response = await fetch("http://13.124.69.147:8080/api/profiles");
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching profile image paths:", error);
    return [];
  }
};

const GetVisitCount = async (capsuleId) => {
  try {
    const response = await fetch(
      `http://13.124.69.147:8080/api/capsules/${capsuleId}/visits`
    );
    const result = await response.json();
    return result.data.visitCount;
  } catch (error) {
    console.error("Error fetching visit count:", error);
    return 0;
  }
};

const GetLikeCount = async (capsuleId) => {
  try {
    const response = await fetch(
      `http://13.124.69.147:8080/api/capsules/${capsuleId}/likes`
    );
    const result = await response.json();
    return result.data.length;
  } catch (error) {
    return 0;
  }
};

// 좋아요 저장
const SaveLike = async (userId, timeCapsuleId) => {
  try {
    const response = await fetch(
      "http://13.124.69.147:8080/api/capsules/likes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, timeCapsuleId }),
      }
    );
    const data = await response.json();
    console.log("SaveLike result:", data);
    return data;
  } catch (error) {
    console.error("Error saving like:", error);
    return null;
  }
};

// 유저아이디, 내용, 이미지 출력
const Item = ({ capsuleId, writeUser, content, imageList, profileImgPath }) => {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [visitCount, setVisitCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchVisitCount = async () => {
      const count = await GetVisitCount(capsuleId);
      setVisitCount(count);
    };

    const fetchLikeCount = async () => {
      const count = await GetLikeCount(capsuleId);
      setLikeCount(count);
    };

    fetchVisitCount();
    fetchLikeCount();
  }, [capsuleId]);

  //
  const handleLike = async () => {
    const userId = await AsyncStorage.getItem("userId");
    if (userId) {
      await SaveLike(userId, capsuleId);
      setLiked(!liked);
      const newLikeCount = await GetLikeCount(capsuleId);
      setLikeCount(newLikeCount);
    }
  };

  // imageList 배열의 첫 번째 객체의 imagePath를 사용.
  const imageUrl =
    imageList && imageList.length > 0 ? imageList[0].imagePath : null;

  return (
    <View style={styles.item}>
      <View style={styles.userContainer}>
        {profileImgPath ? (
          <Image style={styles.profileImage} source={{ uri: profileImgPath }} />
        ) : (
          <Text>프로필 이미지 없음</Text>
        )}
        <Text style={styles.title}>{writeUser}</Text>
      </View>
      {imageUrl ? (
        <Image style={styles.image} source={{ uri: imageUrl }} />
      ) : (
        <Text>이미지 없음</Text>
      )}
      <Text style={styles.content}>
        {expanded || content.length <= 40
          ? content
          : `${content.slice(0, 40)}...`}
      </Text>
      {content.length > 40 && (
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text style={styles.readMore}>
            {expanded ? "간략히" : "...더보기"}
          </Text>
        </TouchableOpacity>
      )}
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={handleLike} style={styles.likeContainer}>
          <Icon
            name="heart"
            size={24}
            color={liked ? "red" : "#BBBBBB"}
            style={styles.actionIcon}
          />
          <Text style={styles.likeCount}>{likeCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Icon
            name="comment"
            size={24}
            color="#BBBBBB"
            style={styles.actionIcon}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.visitCount}>조회수: {visitCount}</Text>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>댓글</Text>
            <Button title="닫기" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const HomeScreen = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  //로딩 표시 및 데이터 호출갯수 10개로 제한.
  const fetchData = async () => {
    if (loading || !hasMoreData) return;
    setLoading(true);
    try {
      const capsuleResult = await GetCapsule(page, 10);
      const profileResult = await GetProfileImgPath();

      // 데이터 병합 writeUser와 nickname이 일치하는 경우 profileImgPath를 가져와서 병합된 데이터에 추가
      const mergedData = capsuleResult.map((capsule) => {
        const profile = profileResult.find(
          (profile) => profile.nickname === capsule.writeUser
        );
        return {
          ...capsule,
          profileImgPath: profile ? profile.profileImgPath : null,
        };
      });

      setData((prevData) => [...prevData, ...mergedData]);
      setPage((prevPage) => prevPage + 1);
      setLoading(false);

      // 데이터가 limit보다 적게 오면 더 이상 데이터가 없다는 의미이므로 hasMoreData를 false로 설정
      if (capsuleResult.length < 10) {
        setHasMoreData(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 스크롤이 끝에 도달했을 때 추가 데이터를 로드.
  const handleLoadMore = () => {
    fetchData();
  };

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="large" color="#0000ff" />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <Item
            capsuleId={item.capsuleId}
            content={item.content}
            writeUser={item.writeUser}
            imageList={item.imageList}
            profileImgPath={item.profileImgPath}
          />
        )}
        keyExtractor={(item) => item.capsuleId.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.75}
        ListFooterComponent={renderFooter}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: "white",
  },
  item: {
    backgroundColor: "white",
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 0,
  },
  title: {
    fontSize: 24,
  },
  content: {
    fontSize: 16,
    marginVertical: 8,
  },
  image: {
    flex: 1,
    width: "100%",
    height: 200,
    marginTop: 8,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginTop: 8,
    marginRight: 12,
  },
  readMore: {
    color: "#BBBBBB",
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 8,
  },
  actionIcon: {
    marginRight: 16,
  },
  likeCount: {
    fontSize: 14,
    color: "#888888",
    marginTop: 4,
  },
  visitCount: {
    marginTop: 8,
    fontSize: 14,
    color: "#888888",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    height: "60%",
    backgroundColor: "#f2f2f2",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  likeContainer: {
    alignItems: "center", // 아이콘과 숫자를 가운데 정렬
  },
});

export default HomeScreen;
