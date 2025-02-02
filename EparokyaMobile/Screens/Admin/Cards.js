import React from "react";
import { StyleSheet, TouchableOpacity, Image, ScrollView, View } from "react-native";
import { Box } from "native-base";
import { useNavigation } from "@react-navigation/native";

const Cards = () => {
  const navigation = useNavigation();

  const cards = [
    { route: "Forms", image: require("../../assets/14.png") },
    { route: "UserList", image: require("../../assets/FORMS.png") },
    { route: "AdminAvailableDates", image: require("../../assets/3.png") },
    { route: "ministryCategory", image: require("../../assets/4.png") },
    { route: "ministryList", image: require("../../assets/5.png") },
    { route: "announcementCategory", image: require("../../assets/6.png") },
    { route: "announcementCategoryList", image: require("../../assets/7.png") },
    { route: "announcement", image: require("../../assets/8.png") },
    { route: "CreateMemberYear", image: require("../../assets/9.png") },
    { route: "Members", image: require("../../assets/10.png") },
    { route: "MemberList", image: require("../../assets/11.png") },
    { route: "resourceCategory", image: require("../../assets/12.png") },
    { route: "createPostResource", image: require("../../assets/13.png") },
  ];

  return (
    <Box style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.row}>
          {cards.map((card, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => navigation.navigate(card.route)}
            >
              <Image source={card.image} style={styles.image} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#b3cf99",
    padding: 10,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    aspectRatio: 1,
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default Cards;
