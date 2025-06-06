import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  Linking,
  ScrollView,
} from "react-native";
import { Box, VStack, HStack, IconButton, Icon, Badge } from "native-base";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { useSelector } from "react-redux";
import baseURL from "../../assets/common/baseUrl";

const ResourcePage = () => {
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [bookmarkedResources, setBookmarkedResources] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const user = useSelector((state) => state.auth.user);
  const config = { withCredentials: true };

  useEffect(() => {
    fetchResources();
    fetchCategories();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await axios.get(`${baseURL}/getAllResource`);
      setResources(response.data.data || []);
    } catch (error) {
      console.error("Error fetching resources:", error);
      setResources([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${baseURL}/getAllResourceCategory`);
      setCategories(response.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const handleBookmark = async (resourceId) => {
    try {
      const response = await axios.post(
        `${baseURL}/toggleBookmark/${resourceId}`,
        { userId: user._id },
        config
      );

      if (response.data.success) {
        const updatedResource = response.data.resource;

        // Update bookmarked resource IDs
        setBookmarkedResources((prev) =>
          prev.includes(resourceId)
            ? prev.filter((id) => id !== resourceId)
            : [...prev, resourceId]
        );

        // Update the resource in the main resource list
        setResources((prevResources) =>
          prevResources.map((resource) =>
            resource._id === updatedResource._id
              ? {
                  ...resource,
                  bookmarkCount: updatedResource.bookmarkCount,
                  isBookmarked: !resource.isBookmarked,
                }
              : resource
          )
        );
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const handleOpenModal = (link) => {
    setModalContent(link);
    setModalVisible(true);
  };

  const displayedResources = resources.filter((resource) => {
    const matchesCategory = selectedCategory
      ? resource.resourceCategory?._id === selectedCategory
      : true;
    const matchesSearch = searchTerm
      ? resource.title.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  const renderCategoryChips = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginBottom: 16 }}
    >
      <TouchableOpacity onPress={() => setSelectedCategory(null)}>
        <Badge
          colorScheme={selectedCategory === null ? "primary" : "muted"}
          mr={2}
        >
          All
        </Badge>
      </TouchableOpacity>
      {categories.map((category) => (
        <TouchableOpacity
          key={category._id}
          onPress={() => setSelectedCategory(category._id)}
        >
          <Badge
            colorScheme={
              selectedCategory === category._id ? "primary" : "muted"
            }
            mr={2}
          >
            {category.name}
          </Badge>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderResourceCard = ({ item }) => (
    <Box
      bg="white"
      p={4}
      mb={3}
      borderRadius={16}
      shadow={2}
      style={{ position: "relative" }}
    >
      {/* Bookmark Icon */}
      <TouchableOpacity
        style={{ position: "absolute", top: 12, right: 12, zIndex: 2 }}
        onPress={() => handleBookmark(item._id)}
      >
        <Icon
          as={FontAwesome}
          name={
            bookmarkedResources.includes(item._id) ? "bookmark" : "bookmark-o"
          }
          size="lg"
          color={
            bookmarkedResources.includes(item._id) ? "yellow.500" : "gray.400"
          }
        />
      </TouchableOpacity>

      {/* Title and Date */}
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 2 }}>
        {item.title}
      </Text>
      <Text style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>
        Created on:{" "}
        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}
      </Text>

      {/* Description */}
      <Text style={{ fontSize: 14, color: "#444", marginBottom: 8 }}>
        {item.description}
      </Text>

      {/* Reference Link */}
      <Text style={{ fontSize: 14, marginBottom: 10 }}>
        <Text style={{ fontWeight: "bold" }}>Reference Link:</Text>{" "}
        <Text
          style={{ color: "#2563eb", textDecorationLine: "underline" }}
          onPress={() => handleOpenModal(item.link)}
        >
          Click for the reference link
        </Text>
      </Text>

      {/* Preview Image or File */}
      {item.images && item.images.length > 0 ? (
        <Image
          source={{ uri: item.images[0].url }}
          style={{
            width: "100%",
            height: 120,
            borderRadius: 12,
            marginBottom: 10,
            backgroundColor: "#eee",
          }}
          resizeMode="cover"
        />
      ) : item.file && item.file.url ? (
        <TouchableOpacity
          style={{
            width: "100%",
            height: 120,
            borderRadius: 12,
            backgroundColor: "#f5f5f5",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
          }}
          onPress={() => Linking.openURL(item.file.url)}
        >
          <FontAwesome name="file-pdf-o" size={40} color="#d32f2f" />
          <Text style={{ color: "#d32f2f", marginTop: 4 }}>View PDF</Text>
        </TouchableOpacity>
      ) : null}

      {/* View Full File Button */}
      {item.file && item.file.url && (
        <TouchableOpacity
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            backgroundColor: "#d5edd9",
            borderRadius: 5,
            alignSelf: "center",
            marginBottom: 8,
          }}
          onPress={() => Linking.openURL(item.file.url)}
        >
          <Text style={{ color: "#26572E", fontWeight: "bold" }}>
            View Full File
          </Text>
        </TouchableOpacity>
      )}

      {/* Bookmark Count */}
      <Text style={{ fontSize: 12, color: "gray", marginTop: 10 }}>
        Number of users who bookmarked this post: {item.bookmarkCount || 0}
      </Text>
    </Box>
  );

  return (
    <VStack flex={1} bg="gray.100" p={4}>
      {/* Search Bar */}
      <HStack space={2} mb={4}>
        <TextInput
          placeholder="Search resources by title"
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: "white",
            borderRadius: 8,
            fontSize: 16,
          }}
        />
      </HStack>

      {/* Categories */}
      {renderCategoryChips()}

      {/* Resource List */}
      <FlatList
        data={displayedResources}
        keyExtractor={(item) => item._id}
        renderItem={renderResourceCard}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#888", marginTop: 40 }}>
            No resources found.
          </Text>
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <Box bg="white" p={4} borderRadius={8} width="85%">
            <HStack justifyContent="space-between" alignItems="center">
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                Resource Link
              </Text>
              <IconButton
                icon={<Icon as={MaterialIcons} name="close" />}
                onPress={() => setModalVisible(false)}
              />
            </HStack>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                if (modalContent) Linking.openURL(modalContent);
              }}
            >
              <Text
                style={{ color: "#2563eb", marginTop: 16, fontWeight: "bold" }}
              >
                {modalContent}
              </Text>
            </TouchableOpacity>
          </Box>
        </View>
      </Modal>
    </VStack>
  );
};

export default ResourcePage;
