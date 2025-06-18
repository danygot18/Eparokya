import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  View,
} from "react-native";
import { Box, Text } from "native-base";
import { useNavigation } from "@react-navigation/native";

const SubmittedForms = () => {
  const navigation = useNavigation();

  const cards = [
    { route: "SubmittedWeddingList", image: require("../../assets/submittedWeddingList.png") },
    { route: "SubmittedFuneralList", image: require("../../assets/submittedFuneralList.png") },
    { route: "SubmittedBaptismList", image: require("../../assets/submittedBaptismalList.png") },
    { route: "SubmittedCounselingList", image: require("../../assets/submittedCounselingList.png") },
    { route: "SubmittedHouseBlessingList", image: require("../../assets/submittedHouseBlessingList.png") },
    { route: "SubmittedPrayerRequestList", image: require("../../assets/submittedPrayerRequests.png") },

  ];


  const cards2 = [
    { route: "SubmittedMassWeddingList", image: require("../../assets/submittedWeddingList.png") },

    { route: "SubmittedMassBaptismList", image: require("../../assets/submittedBaptismalList.png") },
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
        <Text fontSize={24} fontWeight="bold" textAlign="center" mb="$2">
          Mass Forms
        </Text>
        <View style={styles.row}>
          {cards2.map((card, index) => (
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

export default SubmittedForms;
