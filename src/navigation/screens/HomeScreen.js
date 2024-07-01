import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import UserTag from "../../components/UserData/UserTag";
import Feed from "../../components/Feed/Feed";

//피드 내용 쫙 뿌려야함.

const HomeScreen = () => {
  return (
    <>
      {/* <FlatList
        data={Feed}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      /> */}
      <View>
        <View style={styles.feedContainer}>
          <UserTag />
          <Feed />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  feedContainer: {
    marginBottom: 40,
  },
});

export default HomeScreen;
