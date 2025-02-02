import React from "react";
import { StyleSheet, TouchableOpacity, Image, ScrollView, View } from "react-native";
import { Box } from "native-base";
import { useNavigation } from "@react-navigation/native";

const UserForms = () => {
  const navigation = useNavigation();

  const cards = [
    { route: "WeddingForm", image: require("../../assets/17.png") },
    { route: "BinyagForm", image: require("../../assets/18.png") },
    { route: "FuneralForm", image: require("../../assets/18.png") },

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

export default UserForms;
