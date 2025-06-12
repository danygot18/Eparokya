import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Dimensions,
} from "react-native";
import Toast from "react-native-toast-message";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

const { width } = Dimensions.get("window");

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
        // FILO: sort by dateCreated ASC (oldest first), then reverse for newest first
        const sortedAnnouncements = response.data.announcements
          .sort((a, b) => new Date(a.dateCreated) - new Date(b.dateCreated))
          .reverse();
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
        ? (announcement.name &&
            announcement.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
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
        contentContainerStyle={{ alignItems: "center" }}
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
        style={[
          styles.paginationButton,
          currentPage === 1 && styles.paginationButtonDisabled,
        ]}
        onPress={handlePreviousPage}
        disabled={currentPage === 1}
      >
        <Text style={styles.paginationText}>Previous</Text>
      </TouchableOpacity>
      <Text style={styles.paginationText}>
        Page {currentPage} of {totalPages}
      </Text>
      <TouchableOpacity
        style={[
          styles.paginationButton,
          currentPage === totalPages && styles.paginationButtonDisabled,
        ]}
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
      activeOpacity={0.9}
    >
      <Text style={styles.title}>{item.name || "No Title Available"}</Text>
      <Text style={styles.desc}>{item.description || "No Description Available"}</Text>
      {/* Image Slider */}
      {item.images && item.images.length > 0 ? (
        <ImageSlider images={item.images} />
      ) : item.image ? (
        <Image source={{ uri: item.image }} style={styles.media} />
      ) : null}

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
      <Text style={styles.dateText}>
        {item.dateCreated
          ? new Date(item.dateCreated).toLocaleString()
          : ""}
      </Text>
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
        showsVerticalScrollIndicator={false}
      />
      <Toast />
    </View>
  );
};

// Image slider for multiple images
const ImageSlider = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef();

  const onScroll = (event) => {
    const slide = Math.round(
      event.nativeEvent.contentOffset.x / width
    );
    setActiveIndex(slide);
  };

  return (
    <View style={styles.sliderContainer}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        ref={scrollRef}
        style={styles.slider}
      >
        {images.map((img, idx) => (
          <Image
            key={idx}
            source={{ uri: img.url }}
            style={styles.sliderImage}
          />
        ))}
      </ScrollView>
      <View style={styles.sliderDots}>
        {images.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.sliderDot,
              idx === activeIndex && styles.sliderDotActive,
            ]}
          />
        ))}
      </View>
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

  useEffect(() => {
    setLikeCount(item.likedBy?.length || 0);
    setIsLiked(item.likedBy?.includes(user?._id));
  }, [item.likedBy, user?._id]);

  return (
    <>
      <TouchableOpacity onPress={toggleLike}>
        <MaterialIcons
          name="thumb-up"
          size={22}
          color={isLiked ? "#1976d2" : "#bbb"}
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
    paddingHorizontal: 6,
  },
  header: {
    height: 160,
    position: "relative",
    marginBottom: 8,
  },
  headerBackground: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6f2e6",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#2f4f2f",
    marginRight: 8,
  },
  searchIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  categoryContainer: {
    flexDirection: "row",
    marginHorizontal: 0,
    paddingVertical: 6,
    marginBottom: 6,
  },
  categoryBox: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e6f2e6",
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginHorizontal: 4,
    borderRadius: 16,
    minWidth: 60,
    minHeight: 32,
  },
  selectedCategory: {
    borderColor: "#388e3c",
    borderWidth: 2,
    backgroundColor: "#fff",
  },
  categoryText: {
    fontSize: 14,
    color: "#2f4f2f",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    marginVertical: 8,
    marginHorizontal: 2,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#388e3c",
    marginBottom: 2,
  },
  desc: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
  },
  media: {
    width: "100%",
    height: 160,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: "#e6f2e6",
  },
  interactionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 2,
  },
  countText: {
    marginLeft: 5,
    fontSize: 13,
    color: "#388e3c",
  },
  dateText: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
    textAlign: "right",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginTop: 8,
  },
  paginationButton: {
    paddingVertical: 7,
    paddingHorizontal: 18,
    backgroundColor: "#e6f2e6",
    borderRadius: 8,
    marginHorizontal: 4,
  },
  paginationButtonDisabled: {
    backgroundColor: "#eee",
  },
  paginationText: {
    fontSize: 15,
    color: "#388e3c",
    fontWeight: "bold",
  },
  // Image slider styles
  sliderContainer: {
    width: "100%",
    height: 180,
    marginTop: 10,
    marginBottom: 4,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#e6f2e6",
  },
  slider: {
    width: "100%",
    height: 180,
  },
  sliderImage: {
    width: width - 40,
    height: 180,
    resizeMode: "cover",
    borderRadius: 10,
    marginHorizontal: 0,
  },
  sliderDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  sliderDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#bbb",
    marginHorizontal: 2,
  },
  sliderDotActive: {
    backgroundColor: "#388e3c",
  },
});

export default AnnouncementPage;