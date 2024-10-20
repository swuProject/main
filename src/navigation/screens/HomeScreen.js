import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  RefreshControl,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Swiper from "react-native-swiper";

// 관광 api 활용 캡슐
import FestivalScreen from "./FestivalScreen";
import TourScreen from "./TourScreen";

const base_url = "https://tuituiworld.store:8443";

const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem("accessToken"); // 저장된 토큰 키 확인
    if (token !== null) {
      return token;
    } else {
      console.error("No token found in AsyncStorage");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

// page와 limit 사용해서 데이터 타임캡슐 데이터 가져옴.
const GetCapsule = async (page, limit) => {
  try {
    const token = await getAuthToken(); // JWT 토큰 가져오기

    console.log(`Fetching capsules for page: ${page}, limit: ${limit}`);

    const response = await fetch(
      `${base_url}/api/capsules?pageNo=${page}&pageSize=${limit}&sortBy=writeAt`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // JWT 토큰 헤더에 추가
        },
      }
    );

    const result = await response.json();

    // 서버에서 올바른 응답을 받았는지 확인하고 데이터 반환
    if (result.status === "OK" && result.data) {
      console.log("Response contents:", result.data.contents); // contents 배열 로그
      return result.data.contents; // contents 배열 반환
    } else {
      console.log("Invalid response format or status:", result);
      return [];
    }
  } catch (error) {
    console.error("Error fetching capsules:", error);
    return [];
  }
};

// 캡슐을 작성한 유저의 프로필 이미지를 가져오는 함수
const GetProfileImgPath = async (capsuleId) => {
  try {
    const token = await getAuthToken(); // JWT 토큰 가져오기
    const response = await fetch(`${base_url}/api/capsules/${capsuleId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // JWT 토큰 헤더에 추가
      },
    });

    const result = await response.json();

    // 응답이 성공이고, 프로필 이미지 경로가 있는지 확인
    if (result.status === "OK" && result.data && result.data.profileImgPath) {
      return result.data.profileImgPath; // 프로필 이미지 경로 반환
    } else {
      console.log("Invalid response format or missing profileImgPath:", result);
      return null; // 프로필 이미지 경로가 없을 경우 null 반환
    }
  } catch (error) {
    console.error("Error fetching profile image path:", error);
    return null; // 에러 시 null 반환
  }
};

// 조회수
// const GetVisitCount = async (capsuleId) => {
//   try {
//     const token = await getAuthToken(); // JWT 토큰 가져오기
//     const response = await fetch(
//       `${base_url}/api/capsules/${capsuleId}/visits`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`, // JWT 토큰 헤더에 추가
//         },
//       }
//     );

//     const result = await response.json();
//     console.log("API Response:", result); // 응답 데이터 로그로 출력

//     // 응답 상태와 데이터 유효성 검사
//     if (
//       result.status === "OK" &&
//       result.data &&
//       typeof result.data.visitCount === "number"
//     ) {
//       return result.data.visitCount;
//     } else {
//       console.error("Invalid response format:", result);
//       return 0; // 유효하지 않은 경우 기본값 0 반환
//     }
//   } catch (error) {
//     console.error("Error fetching visit count:", error);
//     return 0; // 에러 발생 시 기본값 0 반환
//   }
// };

// 좋아요 저장
const SaveLike = async (profileId, timeCapsuleId) => {
  try {
    const token = await getAuthToken(); // JWT 토큰 가져오기
    const response = await fetch(`${base_url}/api/capsules/likes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // JWT 토큰 헤더에 추가
      },
      body: JSON.stringify({ profileId, timeCapsuleId }),
    });

    const data = await response.json();

    // 응답 상태와 데이터 유효성 검사
    if (data.status === "OK" && Array.isArray(data.data)) {
      return data.data; // 성공 시 좋아요 데이터를 반환
    } else {
      return null; // 유효하지 않은 경우 null 반환
    }
  } catch (error) {
    console.error("Error saving like:", error);
    return null; // 에러 발생 시 null 반환
  }
};

// 좋아요 삭제 함수
const DeleteLike = async (capsuleLikeId) => {
  try {
    const token = await getAuthToken();
    // API 요청 전송
    const response = await fetch(
      `${base_url}/api/capsules/likes/${capsuleLikeId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    // 응답 처리
    if (!response.ok) {
      throw new Error(`Failed to unlike the capsule: ${response.status}`);
    }

    return result;
  } catch (error) {
    console.error("Error during DeleteLike:", error);
    return null;
  }
};

const getCapsuleLikeId = async (capsuleId) => {
  try {
    const profileId = await AsyncStorage.getItem("profileId");
    const token = await getAuthToken();

    // 3. API 호출
    const response = await fetch(
      `${base_url}/api/capsules/${capsuleId}/likes`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (result && result.data && Array.isArray(result.data)) {
      const userLike = result.data.find(
        (like) => like.profileId === parseInt(profileId)
      );
      return (capsuleLikeId = userLike ? userLike.capsuleLikeId : null);
    }
  } catch (error) {
    console.error("Error fetching capsuleLikeId: ", error);
    return null;
  }
};

// 좋아요 숫자 받아오는 함수
const GetLikeCount = async (capsuleId) => {
  try {
    const token = await getAuthToken(); // JWT 토큰 가져오기
    const profileId = await AsyncStorage.getItem("profileId"); // 현재 유저의 profileId 가져오기

    const response = await fetch(
      `https://tuituiworld.store:8443/api/capsules/${capsuleId}/likes`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // JWT 토큰 헤더에 추가
        },
      }
    );

    const result = await response.json();

    // 응답이 성공이고, data가 배열이면 길이를 반환
    if (result.status === "OK" && Array.isArray(result.data)) {
      const likeCount = result.data.length; // 좋아요를 누른 유저 수 반환
      const userLiked = result.data.some(
        (user) => user.profileId === parseInt(profileId)
      );
      return { likeCount, userLiked };
    } else {
      return { likeCount: 0, userLiked: false }; // 적절한 처리
    }
  } catch (error) {
    console.log("Error fetching like count:", error);
    return { likeCount: 0, userLiked: false }; // 에러 시 처리
  }
};

// 댓글 숫자 받아오는 함수
const GetCommentCount = async (capsuleId) => {
  try {
    const token = await getAuthToken(); // JWT 토큰 가져오기

    const response = await fetch(
      `https://tuituiworld.store:8443/api/capsules/${capsuleId}/comments`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // JWT 토큰 헤더에 추가
        },
      }
    );

    const result = await response.json();

    // 응답이 성공이고, data가 배열이면 길이를 반환
    if (result.status === "OK" && Array.isArray(result.data)) {
      return result.data.length; // 작성한 댓글의 수
    } else {
      return 0; // 적절한 처리
    }
  } catch (error) {
    console.error("Error fetching like count:", error);
    return 0; // 에러 시 0 반환
  }
};

// 해당하는 capsuleId 댓글을 가져옴.
const GetComments = async (capsuleId) => {
  try {
    const token = await getAuthToken(); // JWT 토큰 가져오기
    const response = await fetch(
      `${base_url}/api/capsules/${capsuleId}/comments`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // JWT 토큰 헤더에 추가
        },
      }
    );

    const result = await response.json();
    console.log("Fetched comments:", result); // 디버깅용 로그

    // 응답 데이터의 유효성 검사
    if (result.status === "OK" && Array.isArray(result.data)) {
      return result.data; // 유효한 데이터 반환
    } else {
      return []; // 유효하지 않은 경우 빈 배열 반환
    }
  } catch (error) {
    console.error("Error fetching comments:", error);
    return []; // 에러 발생 시 빈 배열 반환
  }
};

// 캡슐을 삭제하는 함수
const deleteCapsule = async (capsuleId) => {
  try {
    const token = await getAuthToken(); // JWT 토큰 가져오기
    const response = await fetch(`${base_url}/api/capsules/${capsuleId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // JWT 토큰 헤더에 추가
      },
    });

    if (response.ok) {
      // 삭제 성공
      console.log("Capsule deleted successfully");
      return true; // 성공 여부를 반환할 수 있음
    } else {
      // 삭제 실패
      const errorData = await response.json();
      console.error("Failed to delete capsule:", errorData);
      return false; // 실패 여부를 반환할 수 있음
    }
  } catch (error) {
    // 네트워크 오류 또는 다른 오류 처리
    console.error("Error occurred while deleting capsule:", error);
    return false;
  }
};

// 새로운 댓글을 서버에 저장하는 함수
const SaveComment = async (
  profileId,
  capsuleId,
  comment,
  parentCommentId = null // refCommentId -> parentCommentId로 수정
) => {
  try {
    const token = await getAuthToken(); // JWT 토큰 가져오기
    const response = await fetch(`${base_url}/api/capsules/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // JWT 토큰 헤더에 추가
      },
      body: JSON.stringify({
        profileId,
        comment,
        timeCapsuleId: capsuleId,
        parentCommentId, // refCommentId 대신 parentCommentId로 사용
      }),
    });

    const result = await response.json();
    console.log("Saved comment result:", result); // 디버깅용 로그

    // 응답 상태 확인 및 데이터 반환
    if (result.status === "OK") {
      return result.data; // 성공적인 응답 데이터 반환
    } else {
      console.error("Error in response:", result.message);
      return null;
    }
  } catch (error) {
    console.error("Error saving comment:", error);
    return null; // 에러 발생 시 null 반환
  }
};

// 댓글 삭제 함수
const DeleteComment = async (capsuleId, commentId) => {
  try {
    console.log("삭제하려는 commentId:", commentId); // commentId 값 확인용 로그

    const token = await getAuthToken(); // JWT 토큰 가져오기

    // DELETE 요청 보내기
    const response = await fetch(
      `${base_url}/api/capsules/comments/${commentId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // JWT 토큰 헤더에 추가
        },
      }
    );

    // 응답 상태 확인
    const responseText = await response.text();
    if (response.ok) {
      console.log("댓글이 성공적으로 삭제되었습니다.");
      return true; // 성공
    } else {
      console.log("댓글 삭제 실패:", responseText);
      return false; // 실패
    }
  } catch (error) {
    console.error("댓글 삭제 중 오류 발생:", error);
    return false;
  }
};

//댓글 Item
const CommentItem = ({
  comment,
  nickname,
  profileImgPath,
  capsuleId,
  commentId,
  onDelete,
}) => {
  const [menuVisible, setMenuVisible] = useState(false); // 메뉴 표시 상태 관리

  // 댓글 삭제 처리
  const handleDeleteComment = async () => {
    const success = await DeleteComment(capsuleId, commentId); // capsuleId와 commentId를 전달
    if (success) {
      onDelete(commentId); // 성공적으로 삭제된 경우 상위 컴포넌트에 알림
    }
    setMenuVisible(false); // 메뉴 숨기기
  };

  return (
    <View style={styles.commentItem}>
      {/* 프로필 이미지 */}
      {profileImgPath ? (
        <Image
          style={styles.commentProfileImage}
          source={{ uri: profileImgPath }}
        />
      ) : (
        <Text style={styles.noProfileImage}>프로필 이미지 없음</Text>
      )}

      {/* 닉네임 및 댓글 내용 */}
      <View style={styles.commentTextContainer}>
        <Text style={styles.commentNickname}>{nickname}</Text>
        <Text style={styles.commentText}>{comment}</Text>
      </View>

      {/* ••• 아이콘 */}
      <TouchableOpacity
        onPress={() => setMenuVisible(!menuVisible)}
        style={styles.menuIconContainer}
      >
        <Icon2 name="dots-horizontal" size={24} color="#BBBBBB" />
      </TouchableOpacity>

      {/* 삭제 버튼 표시 */}
      {menuVisible && (
        <View style={styles.menuContainer}>
          <TouchableOpacity onPress={handleDeleteComment}>
            <Text style={styles.deleteButton}>댓글 삭제</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const Item = ({
  capsuleId,
  nickname,
  content,
  imageList,
  profileImgPath,
  initialLiked,
  handleRefresh, // props로 받아오기
}) => {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(initialLiked);
  const [modalVisible, setModalVisible] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [menuVisible, setMenuVisible] = useState(false); // 메뉴 표시 상태
  const [deleting, setDeleting] = useState(false); // 삭제 진행 상태
  const [currentUserNickname, setCurrentUserNickname] = useState("");

  useEffect(() => {
    const fetchLikeCount = async () => {
      const { likeCount, userLiked } = await GetLikeCount(capsuleId);
      setLikeCount(likeCount);
      setLiked(userLiked);
    };

    const fetchCommentCount = async () => {
      const count = await GetCommentCount(capsuleId);
      setCommentCount(count);
    };

    const fetchCurrentUserNickname = async () => {
      const nickname = await AsyncStorage.getItem("nickname");
      setCurrentUserNickname(nickname);
    };

    fetchCommentCount();
    fetchLikeCount();
    fetchCurrentUserNickname();
  }, [capsuleId]);

  const handleDeleteComment = (commentId) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.commentId !== commentId)
    );
  };

  const updateCommentCount = async () => {
    const count = await GetCommentCount(capsuleId);
    setCommentCount(count);
  };

  updateCommentCount();

  const handleLike = async () => {
    const userId = await AsyncStorage.getItem("profileId");
    const capsuleLikeId = await getCapsuleLikeId(capsuleId);

    if (liked) {
      await DeleteLike(capsuleLikeId);
      setLiked(false);
      setLikeCount((prevCount) => prevCount - 1);
    } else {
      await SaveLike(userId, capsuleId);
      setLiked(true);
      setLikeCount((prevCount) => prevCount + 1);
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

  const handleDeleteCapsule = async () => {
    setDeleting(true);
    const success = await deleteCapsule(capsuleId);
    if (success) {
      console.log("Capsule successfully deleted");
      await handleRefresh(); // 삭제 후 새로고침
    } else {
      console.log("Failed to delete capsule");
    }
    setDeleting(false);
  };

  return (
    <View style={styles.item}>
      <View style={styles.userContainer}>
        {profileImgPath ? (
          <Image style={styles.profileImage} source={{ uri: profileImgPath }} />
        ) : (
          <Text>프로필 이미지 없음</Text>
        )}
        <Text style={styles.title}>{nickname}</Text>
        <TouchableOpacity
          onPress={() => setMenuVisible(!menuVisible)}
          style={{ position: "absolute", right: 10, top: 10 }} // 오른쪽 상단에 배치
        >
          <Icon2 name="dots-horizontal" size={24} color="#BBBBBB" />
        </TouchableOpacity>

        {/* 메뉴 (삭제 버튼) */}
        {menuVisible && nickname === currentUserNickname && (
          <View style={styles.menuContainer}>
            <TouchableOpacity onPress={handleDeleteCapsule} disabled={deleting}>
              <Text style={styles.deleteButton}>
                {deleting ? "삭제 중..." : "캡슐 삭제"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Swiper 및 이미지 렌더링 */}
      {imageList && imageList.length > 0 ? (
        <Swiper
          style={styles.swiperContainer}
          loop={false}
          showsPagination={true}
        >
          {imageList.map((item, index) => (
            <Image
              key={index}
              style={[styles.image, { resizeMode: "cover" }]}
              source={{ uri: item.imagePath }}
              onError={(error) => console.log("Image load error:", error)}
            />
          ))}
        </Swiper>
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

      {/* 좋아요 및 댓글 */}
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
          <Text style={styles.likeCount}>{commentCount}</Text>
        </TouchableOpacity>
      </View>

      {/* 댓글 모달 */}
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
                  profileImgPath={item.profileImgPath}
                  capsuleId={capsuleId}
                  commentId={item.commentId}
                  onDelete={handleDeleteComment}
                />
              )}
              keyExtractor={(item) => item.commentId.toString()}
            />
            <TextInput
              style={styles.commentInput}
              value={newComment}
              onChangeText={setNewComment}
              placeholder="댓글을 입력하세요"
              onSubmitEditing={handleSaveComment}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.buttonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const HomeScreen = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [likedCapsules, setLikedCapsules] = useState([]); // 좋아요 데이터 상태 추가
  const [refreshing, setRefreshing] = useState(false); // 새로고침 상태 추가
  const [festivalDisplayed, setFestivalDisplayed] = useState(false); // FestivalScreen 표시 여부 상태
  const [tourDisplayed, setTourDisplayed] = useState(false); // TourScreen 표시 여부 상태

  const fetchData = async () => {
    if (loading || !hasMoreData) return;
    setLoading(true);
    try {
      const capsuleResult = await GetCapsule(page, 10);
      const profileImgPromises = capsuleResult.map(
        (capsule) => GetProfileImgPath(capsule.capsuleId) // 각 캡슐의 프로필 이미지 경로 가져오기
      );

      const profileImgPaths = await Promise.all(profileImgPromises); // 모든 프로필 이미지 경로 가져오기

      const newData = capsuleResult.map((capsule, index) => ({
        ...capsule,
        profileImgPath: profileImgPaths[index], // 해당 캡슐에 맞는 프로필 이미지 경로 설정
        initialLiked: likedCapsules.includes(capsule.capsuleId),
      }));

      const uniqueData = newData.filter(
        (newCapsule) =>
          !data.some(
            (existingCapsule) =>
              existingCapsule.capsuleId === newCapsule.capsuleId
          )
      );

      setData((prevData) => [...prevData, ...uniqueData]);
      setPage((prevPage) => prevPage + 1);
      setLoading(false);

      if (capsuleResult.length < 10) {
        setHasMoreData(false);
      }

      // FestivalScreen과 TourScreen을 한 번만 표시하도록 조건 추가
      if (data.length + uniqueData.length >= 5 && !festivalDisplayed) {
        setFestivalDisplayed(true);
      }

      if (data.length + uniqueData.length >= 10 && !tourDisplayed) {
        setTourDisplayed(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(0); // 페이지를 0으로 리셋하여 처음부터 다시 로드
    setHasMoreData(true); // 더 많은 데이터가 있다고 가정
    setFestivalDisplayed(false); // 새로고침 시 FestivalScreen을 다시 숨김
    setTourDisplayed(false); // 새로고침 시 TourScreen을 다시 숨김
    try {
      const capsuleResult = await GetCapsule(0, 10);
      const profileImgPromises = capsuleResult.map(
        (capsule) => GetProfileImgPath(capsule.capsuleId) // 각 캡슐의 프로필 이미지 경로 가져오기
      );

      const profileImgPaths = await Promise.all(profileImgPromises); // 모든 프로필 이미지 경로 가져오기

      const mergedData = capsuleResult.map((capsule, index) => {
        return {
          ...capsule,
          profileImgPath: profileImgPaths[index], // 해당 캡슐에 맞는 프로필 이미지 경로 설정
          initialLiked: likedCapsules.includes(capsule.capsuleId),
        };
      });

      setData(mergedData); // 데이터 리셋
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const profileId = await AsyncStorage.getItem("profileId");
        if (profileId) {
          await fetchData();
        } else {
          console.error("Profile ID not found in AsyncStorage");
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
      nickname={item.nickname}
      content={item.content}
      imageList={item.imageList}
      profileImgPath={item.profileImgPath}
      initialLiked={item.initialLiked}
      handleRefresh={handleRefresh} // handleRefresh를 props로 전달
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
          <>
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {festivalDisplayed && <FestivalScreen />}
            {tourDisplayed && <TourScreen />}
          </>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh} // 새로고침 핸들러
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  item: {
    backgroundColor: "white",
    marginVertical: 12,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
  },
  swiperContainer: {
    height: 250,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  content: {
    fontSize: 14,
    marginTop: 10,
    marginLeft: 10,
  },
  readMore: {
    color: "blue",
    marginTop: 5,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 25,
    marginRight: 10,
    marginLeft: 10,
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
    marginRight: 10,
    marginLeft: 10,
  },
  likeCount: {
    marginLeft: 1,
  },
  visitCount: {
    marginTop: 10,
    fontSize: 14,
    color: "#888",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    width: "100%",
    height: "70%",
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
    height: 44,
    borderColor: "#BBB",
    borderWidth: 0.5,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 8,
    paddingLeft: 10,
  },
  closeButton: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  menuContainer: {
    position: "absolute",
    right: 10,
    top: 40,
    backgroundColor: "white",
    borderRadius: 5,
    elevation: 2,
    zIndex: 1,
  },
  deleteButton: {
    backgroundColor: "red",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default HomeScreen;
