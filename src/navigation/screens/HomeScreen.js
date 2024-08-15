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
  TextInput,
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

const GetCommentCount = async (capsuleId) => {
  try {
    const response = await fetch(
      `http://13.124.69.147:8080/api/capsules/${capsuleId}/comments`
    );
    const result = await response.json();
    return result.data.length;
  } catch (error) {
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
const SaveLike = async (profileId, timeCapsuleId) => {
  try {
    const response = await fetch(
      "http://13.124.69.147:8080/api/capsules/likes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profileId, timeCapsuleId }),
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

// 해당하는 capsuleId 댓글을 가져옴.
const GetComments = async (capsuleId) => {
  try {
    const response = await fetch(
      `http://13.124.69.147:8080/api/capsules/${capsuleId}/comments`
    );
    const result = await response.json();
    console.log("Fetched comments:", result.data); // 디버깅용 로그
    return result.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};

// 새로운 댓글을 서버에 저장하는 함수
const SaveComment = async (
  profileId,
  capsuleId,
  comment,
  refCommentId = null
) => {
  try {
    const response = await fetch(
      `http://13.124.69.147:8080/api/capsules/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileId,
          comment,
          timeCapsuleId: capsuleId,
          refCommentId,
        }),
      }
    );
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error saving comment:", error);
    return null;
  }
};

//댓글 Item
const CommentItem = ({ comment, nickname, profileImgPath }) => {
  console.log("CommentItem Props:", { comment, nickname, profileImgPath }); // 디버깅용 로그
  return (
    <View style={styles.commentItem}>
      {profileImgPath ? (
        <Image
          style={styles.commentProfileImage}
          source={{ uri: profileImgPath }}
        />
      ) : (
        <Text style={styles.noProfileImage}>프로필 이미지 없음</Text>
      )}
      <View style={styles.commentTextContainer}>
        <Text style={styles.commentNickname}>{nickname}</Text>
        <Text style={styles.commentText}>{comment}</Text>
      </View>
    </View>
  );
};

// Item 컴포넌트
const Item = ({
  capsuleId,
  writeUser,
  content,
  imageList,
  profileImgPath,
  initialLiked,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(initialLiked); // 좋아요 상태 초기화
  const [modalVisible, setModalVisible] = useState(false);
  const [visitCount, setVisitCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchVisitCount = async () => {
      const count = await GetVisitCount(capsuleId);
      setVisitCount(count);
    };

    const fetchLikeCount = async () => {
      const count = await GetLikeCount(capsuleId);
      setLikeCount(count);
    };

    const fetchCommentCount = async () => {
      const count = await GetCommentCount(capsuleId);
      setCommentCount(count);
    };

    fetchCommentCount();
    fetchVisitCount();
    fetchLikeCount();
  }, [capsuleId]);

  const handleLike = async () => {
    const userId = await AsyncStorage.getItem("profileId");
    const timeCapsuleId = capsuleId;
    if (userId) {
      await SaveLike(userId, capsuleId);
      setLiked(!liked);
      const newLikeCount = await GetLikeCount(capsuleId);
      setLikeCount(newLikeCount);
    }
  };

  const handleOpenModal = async () => {
    const fetchedComments = await GetComments(capsuleId);
    setComments(fetchedComments);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSaveComment = async () => {
    const profileId = await AsyncStorage.getItem("profileId");
    if (profileId && newComment) {
      await SaveComment(profileId, capsuleId, newComment);
      const updatedComments = await GetComments(capsuleId);
      setComments(updatedComments);
      setCommentCount(updatedComments.length);
      setNewComment("");
    }
  };

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
        <TouchableOpacity
          onPress={handleOpenModal}
          style={styles.likeContainer}
        >
          <Icon
            name="comment"
            size={24}
            color="#BBBBBB"
            style={styles.actionIcon}
          />
          {/* css해야함 */}
          <Text style={styles.likeCount}>{commentCount}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.visitCount}>조회수: {visitCount}</Text>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>댓글</Text>
            <FlatList
              data={comments}
              renderItem={({ item }) => (
                <CommentItem
                  comment={item.comment}
                  nickname={item.nickname}
                  profileImgPath={profileImgPath} // 여기에 올바른 프로필 이미지 경로를 추가
                />
              )}
              keyExtractor={(item) => item.commentId.toString()}
            />
            <TextInput
              style={styles.commentInput}
              value={newComment}
              onChangeText={setNewComment}
              placeholder="댓글을 입력하세요"
            />
            <Button title="댓글 저장" onPress={handleSaveComment} />
            <Button title="닫기" onPress={handleCloseModal} />
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
  const [likedCapsules, setLikedCapsules] = useState([]); // 좋아요 데이터 상태 추가

  const fetchData = async () => {
    if (loading || !hasMoreData) return;
    setLoading(true);
    try {
      const capsuleResult = await GetCapsule(page, 10);
      const profileResult = await GetProfileImgPath();

      const mergedData = capsuleResult.map((capsule) => {
        const profile = profileResult.find(
          (profile) => profile.nickname === capsule.writeUser
        );
        return {
          ...capsule,
          profileImgPath: profile ? profile.profileImgPath : null,
          initialLiked: likedCapsules.includes(capsule.capsuleId),
        };
      });

      setData((prevData) => [...prevData, ...mergedData]);
      setPage((prevPage) => prevPage + 1);
      setLoading(false);

      if (capsuleResult.length < 10) {
        setHasMoreData(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  // 상태
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const profileId = await AsyncStorage.getItem("profileId");
        if (profileId) {
          // Fetch capsules only after liked capsules are set
          await fetchData();
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const renderItem = ({ item }) => (
    <Item
      capsuleId={item.capsuleId}
      writeUser={item.writeUser}
      content={item.content}
      imageList={item.imageList}
      profileImgPath={item.profileImgPath}
      initialLiked={item.initialLiked}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.capsuleId.toString()}
        onEndReached={fetchData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && <ActivityIndicator size="large" color="#0000ff" />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: "white",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  content: {
    fontSize: 16,
    marginTop: 10,
  },
  readMore: {
    color: "blue",
    marginTop: 5,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  actionsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  actionIcon: {
    marginRight: 5,
  },
  likeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  likeCount: {
    marginLeft: 5,
  },
  visitCount: {
    marginTop: 10,
    fontSize: 14,
    color: "#888",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    height: "50%",
  },
  commentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  commentProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentTextContainer: {
    flex: 1,
  },
  commentNickname: {
    fontWeight: "bold",
  },
  commentText: {
    color: "#555",
  },
  noProfileImage: {
    color: "#999",
  },
  commentInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 8,
  },
});

export default HomeScreen;
