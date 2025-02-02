import React from "react";
import { StyleSheet, TouchableOpacity, Image, ScrollView, View } from "react-native";
import { Box } from "native-base";
import { useNavigation } from "@react-navigation/native";

const Forms = () => {
  const navigation = useNavigation();

  const cards = [
    { route: "AdminWedding", image: require("../../assets/15.png") },
    { route: "BaptismList", image: require("../../assets/16.png") },
    { route: "FuneralList", image: require("../../assets/19.png") },
    
    { route: "ConfirmedWedding", image: require("../../assets/2.png") },
    { route: "ConfirmedFuneral", image: require("../../assets/20.png") },

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

export default Forms;
