import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Modal } from "react-native";
import { Box, VStack, HStack, IconButton, Icon, Badge } from "native-base";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { useSelector } from 'react-redux';
import baseURL from '../../assets/common/baseUrl';


const ResourcePage = () => {
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [bookmarkedResources, setBookmarkedResources] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");

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
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const handleBookmark = (resourceId) => {
    setBookmarkedResources((prev) =>
      prev.includes(resourceId) ? prev.filter((id) => id !== resourceId) : [...prev, resourceId]
    );
  };

  const handleOpenModal = (link) => {
    setModalContent(link);
    setModalVisible(true);
  };

  const displayedResources = resources.filter((resource) => {
    const matchesCategory = selectedCategory ? resource.resourceCategory?._id === selectedCategory : true;
    const matchesSearch = searchTerm ? resource.title.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <VStack flex={1} bg="gray.100" p={4}>
      {/* Search Bar */}
      <HStack space={2} mb={4}>
        <TextInput
          placeholder="Search resources by title"
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={{ flex: 1, padding: 10, backgroundColor: "white", borderRadius: 8 }}
        />
      </HStack>
      
      {/* Categories */}
      <HStack space={2} mb={4} flexWrap="wrap">
        <Badge
          colorScheme={selectedCategory === null ? "primary" : "muted"}
          onPress={() => setSelectedCategory(null)}
        >
          All
        </Badge>
        {categories.map((category) => (
          <Badge
            key={category._id}
            colorScheme={selectedCategory === category._id ? "primary" : "muted"}
            onPress={() => setSelectedCategory(category._id)}
          >
            {category.name}
          </Badge>
        ))}
      </HStack>
      
      {/* Resource List */}
      <FlatList
        data={displayedResources}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Box bg="white" p={4} mb={3} borderRadius={8} shadow={2}>
            <HStack justifyContent="space-between" alignItems="center">
              <Text fontSize="md" bold>{item.title}</Text>
              <IconButton
                icon={<Icon as={FontAwesome} name={bookmarkedResources.includes(item._id) ? "bookmark" : "bookmark-o"} size="sm" color="yellow.500" />}
                onPress={() => handleBookmark(item._id)}
              />
            </HStack>
            <Text mt={2}>{item.description}</Text>
            {item.images && item.images.length > 0 && (
              <Image source={{ uri: item.images[0].url }} style={{ width: "100%", height: 150, marginTop: 10, borderRadius: 8 }} />
            )}
            <TouchableOpacity onPress={() => handleOpenModal(item.link)}>
              <Text color="blue.500" mt={2}>View Resource</Text>
            </TouchableOpacity>
          </Box>
        )}
      />

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <Box bg="white" p={4} borderRadius={8} width="80%">
            <HStack justifyContent="space-between">
              <Text bold>Resource Link</Text>
              <IconButton icon={<Icon as={MaterialIcons} name="close" />} onPress={() => setModalVisible(false)} />
            </HStack>
            <Text mt={2}>{modalContent}</Text>
          </Box>
        </View>
      </Modal>
    </VStack>
  );
};

export default ResourcePage;
