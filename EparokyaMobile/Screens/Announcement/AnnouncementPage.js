import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import Toast from "react-native-toast-message";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import SyncStorage from "sync-storage";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

const AnnouncementPage = ({ navigation }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [userId, setUserId] = useState(null);

  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/getAllannouncementCategory`
        );
        setCategories(response.data.categories);
        console.log("Categories:", response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(`${baseURL}/getAllAnnouncements`);
        setAnnouncements(response.data.announcements);
        console.log("Announcements:", response.data);
        setFilteredAnnouncements(response.data.announcements);
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
      }
    };

    fetchCategories();
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    const filtered = announcements.filter((announcement) => {
      const matchesCategory = selectedCategory
        ? announcement.category?._id === selectedCategory
        : true;

      const matchesSearch = searchTerm
        ? announcement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (announcement.tags &&
            announcement.tags.some((tag) =>
              tag.toLowerCase().includes(searchTerm.toLowerCase())
            ))
        : true;

      return matchesCategory && matchesSearch;
    });

    setFilteredAnnouncements(filtered);
  }, [searchTerm, selectedCategory, announcements]);

  const handleSearch = (term) => {
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredAnnouncements(announcements);
      return;
    }

    const filtered = announcements.filter((announcement) =>
      announcement.name.toLowerCase().includes(term.toLowerCase()) ||
      (announcement.tags && announcement.tags.some(tag => tag.toLowerCase().includes(term.toLowerCase())))
    );
    setFilteredAnnouncements(filtered);
  };

  const handleCategoryPress = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleLike = async (announcementId) => {
    if (!user || !token) {
      Toast.show({
        type: "error",
        text1: "Login Required",
        text2: "Please log in to like announcements.",
      });
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.put(
        `${baseURL}/likeAnnouncement/${announcementId}`,
        {},
        config
      );

      const isLikedNow = response.data.liked;
      setAnnouncements((prevAnnouncements) =>
        prevAnnouncements.map((announcement) =>
          announcement._id === announcementId
            ? {
                ...announcement,
                likedBy: isLikedNow
                  ? [...announcement.likedBy, user._id]
                  : announcement.likedBy.filter((uid) => uid !== user._id),
              }
            : announcement
        )
      );
    } catch (error) {
      console.error("Error toggling like:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Unable to update like status.",
      });
    }
  };





  const handleCardPress = (item) => {
    navigation.navigate("AnnouncementDetail", { announcementId: item._id });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/WelcomeHomePage_EParokya.png")}
          style={styles.headerBackground}
        />
        <View style={styles.userInfo}></View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#2f4f2f"
          value={searchTerm}
          onChangeText={(text) => handleSearch(text)}
        />
        <TouchableOpacity style={styles.searchIconContainer}>
          <MaterialIcons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {autocompleteSuggestions.length > 0 && searchTerm && (
        <View style={styles.autocompleteSuggestions}>
          {autocompleteSuggestions.map((item) => (
            <TouchableOpacity
              key={item._id}
              onPress={() => {
                setSearchTerm(item.name);
                handleCardPress(item);
              }}
              style={styles.suggestionItem}
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}


<ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
      >
        <TouchableOpacity
          style={[
            styles.categoryBox,
            selectedCategory === null && styles.selectedCategory,
          ]}
          onPress={() => handleCategoryPress(null)}
        >
          <Text style={styles.categoryText}>All</Text>
        </TouchableOpacity>
        {categories.map((category) => (
          <TouchableOpacity
            key={category._id}
            style={[
              styles.categoryBox,
              selectedCategory === category._id && styles.selectedCategory,
            ]}
            onPress={() => handleCategoryPress(category._id)}
          >
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredAnnouncements}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleCardPress(item)}
          >
            <Text style={styles.title}>
              {item.name || "No Title Available"}
            </Text>
            <Text>{item.description || "No Description Available"}</Text>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.media} />
            )}
            {item.images &&
              item.images.map((img, index) => (
                <Image
                  key={index}
                  source={{ uri: img.url }}
                  style={styles.media}
                />
              ))}

            {/* Like and Comments Count */}

            <View style={styles.interactionContainer}>
              <LikedCount
                handleLike={() => handleLike(item._id)}
                item={item}
                user={user}
              />
              {/* Comments Count */}
              <TouchableOpacity
                onPress={() => handleNavigateToDetail(item._id)}
              >
                <MaterialIcons name="comment" size={24} color="gray" />
              </TouchableOpacity>
              <Text style={styles.countText}>{item.comments?.length || 0}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Toast />
    </ScrollView>
  );
};

//Liked
const LikedCount = ({ handleLike, item, user }) => {
  const [likeCount, setLikeCount] = useState(item.likedBy?.length || 0);
  const [isLiked, setIsLiked] = useState(item.likedBy?.includes(user?._id));

  const toggleLike = async () => {
    await handleLike(item._id);
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <>
      <TouchableOpacity onPress={toggleLike}>
        <MaterialIcons
          name="thumb-up"
          size={24}
          color={isLiked ? "green" : "gray"}
        />
      </TouchableOpacity>
      <Text style={styles.countText}>{likeCount}</Text>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    height: 200,
    position: "relative",
  },
  headerBackground: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  userInfo: {
    position: "absolute",
    bottom: 10,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  welcomeText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  searchInput: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "white",
  },
  categoryContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
  },
  categoryIcon: {
    alignItems: "center",
    marginHorizontal: 10,
  },

  categoryBox: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#b3cf99",
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  selectedCategory: {
    borderColor: "green",
    borderWidth: 2,
  },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  categoryText: {
    fontSize: 16,
    color: "#2f4f2f",
  },
  card: {
    backgroundColor: "#b3cf99",
    padding: 15,
    margin: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  media: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginTop: 10,
  },
  interactionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  countText: {
    marginLeft: 5,
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#b3cf99",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginTop: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#2f4f2f",
    marginRight: 10,
  },
  searchIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  autocompleteSuggestions: {
    backgroundColor: "white",
    borderRadius: 8,
    marginHorizontal: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  suggestionItem: {
    paddingVertical: 5,
  },
});

export default AnnouncementPage;
