import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import Toast from "react-native-toast-message";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

const AnnouncementPage = ({ navigation }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { user, token } = useSelector((state) => state.auth);

  const POSTS_PER_PAGE = 5;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseURL}/getAllannouncementCategory`);
        setCategories(response.data.categories);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(`${baseURL}/getAllAnnouncements`);
        const sortedAnnouncements = response.data.announcements.sort(
          (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
        );
        setAnnouncements(sortedAnnouncements);
        setFilteredAnnouncements(sortedAnnouncements);
        setTotalPages(Math.ceil(sortedAnnouncements.length / POSTS_PER_PAGE));
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
    setTotalPages(Math.ceil(filtered.length / POSTS_PER_PAGE));
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, announcements]);

  const handleSearch = (term) => {
    setSearchTerm(term);
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

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    return filteredAnnouncements.slice(startIndex, endIndex);
  };

  const renderHeader = () => (
    <View>
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
    </View>
  );

  const renderFooter = () => (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        style={styles.paginationButton}
        onPress={handlePreviousPage}
        disabled={currentPage === 1}
      >
        <Text style={styles.paginationText}>Previous</Text>
      </TouchableOpacity>
      <Text style={styles.paginationText}>
        Page {currentPage} of {totalPages}
      </Text>
      <TouchableOpacity
        style={styles.paginationButton}
        onPress={handleNextPage}
        disabled={currentPage === totalPages}
      >
        <Text style={styles.paginationText}>Next</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleCardPress(item)}
    >
      <Text style={styles.title}>{item.name || "No Title Available"}</Text>
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

      <View style={styles.interactionContainer}>
        <LikedCount
          handleLike={() => handleLike(item._id)}
          item={item}
          user={user}
        />
        <TouchableOpacity onPress={() => handleCardPress(item)}>
          <MaterialIcons name="comment" size={24} color="gray" />
        </TouchableOpacity>
        <Text style={styles.countText}>{item.comments?.length || 0}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={getPaginatedData()}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.flatListContent}
      />
      <Toast />
    </View>
  );
};

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
  flatListContent: {
    paddingBottom: 20,
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
  categoryContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
    paddingVertical: 10,
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
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  paginationButton: {
    padding: 10,
    backgroundColor: "#b3cf99",
    borderRadius: 5,
  },
  paginationText: {
    fontSize: 16,
    color: "#2f4f2f",
  },
});

export default AnnouncementPage;