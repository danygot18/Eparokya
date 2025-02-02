import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';
import SyncStorage from 'sync-storage';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const AnnouncementPage = ({ navigation }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const { user, token } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseURL}/getAllannouncementCategory`);
        setCategories(response.data.categories);
        console.log('Categories:', response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(`${baseURL}/getAllAnnouncements`);
        setAnnouncements(response.data.announcements);
        console.log('Categories:', response.data);
        setFilteredAnnouncements(response.data.announcements);
      } catch (err) {
        console.error('Failed to fetch announcements:', err);
      }
    };

    fetchCategories();
    fetchAnnouncements();
  }, []);



  useEffect(() => {
    let filteredData = announcements;
    if (searchQuery) {
      filteredData = filteredData.filter((announcement) =>
        announcement.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setAutocompleteSuggestions(filteredData);
    } else {
      setAutocompleteSuggestions([]);
    }

    if (selectedCategory) {
      filteredData = filteredData.filter(
        (announcement) => announcement.category?._id === selectedCategory
      );
    }
    setFilteredAnnouncements(filteredData);
  }, [searchQuery, selectedCategory, announcements]);

  const handleLike = async (announcementId) => {

    if (!token) {
      Toast.show({ type: 'error', text1: 'Login Required', text2: 'Please log in to perform this action.' });
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.put(`${baseURL}/like/${announcementId}`, null, config);
      setAnnouncements((prev) =>
        prev.map((announcement) =>
          announcement._id === announcementId
            ? { ...announcement, likedBy: response.data.likedBy }
            : announcement
        )
      );
    } catch (error) {
      console.error('Unable to update like status:', error);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Unable to update like status.' });
    }
  };

  const handleCardPress = (item) => {
    navigation.navigate("AnnouncementDetail", { announcementId: item._id });
  };

  const handleSearchInputChange = (text) => {
    setSearchQuery(text);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/WelcomeHomePage_EParokya.png')} style={styles.headerBackground} />
        <View style={styles.userInfo}></View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#2f4f2f"
          value={searchQuery}
          onChangeText={handleSearchInputChange}
        />
        <TouchableOpacity style={styles.searchIconContainer}>
          <MaterialIcons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {autocompleteSuggestions.length > 0 && searchQuery && (
        <View style={styles.autocompleteSuggestions}>
          {autocompleteSuggestions.map((item) => (
            <TouchableOpacity
              key={item._id}
              onPress={() => {
                setSearchQuery(item.name);
                handleCardPress(item);
              }}
              style={styles.suggestionItem}
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}


      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category._id}
            style={[styles.categoryIcon, selectedCategory === category._id && styles.selectedCategory]}
            onPress={() => setSelectedCategory(category._id)}
          >
            <Image source={{ uri: category.image || 'https://via.placeholder.com/50' }} style={styles.categoryImage} />
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={announcements}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleCardPress(item)}
          >
            <Text style={styles.title}>{item.name || 'No Title Available'}</Text>
            <Text>{item.description || 'No Description Available'}</Text>
            {item.image && <Image source={{ uri: item.image }} style={styles.media} />}

            {/* Like and Comments Count */}
            <View style={styles.interactionContainer}>
                <LikedCount handleLike={handleLike} item={item} user={user}/>
              {/* Comments Count */}
              <TouchableOpacity onPress={() => handleNavigateToDetail(item._id)}>
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
  const [likeCount, setLikeCount] = useState(0)
  const [colorLiked, setColorLiked] = useState('gray');

  useEffect(() => {
    setLikeCount(item.likedBy?.length)
    if (item.likedBy?.includes(user?._id)) {
      setColorLiked('green') 
    } else {
      setColorLiked('gray')
    }
  }, [])

  const increaseCountLike = () => {
    setLikeCount(prev => prev + 1)
    handleLike(item._id)
    setColorLiked('green')
  }

  return (
    <>
      <TouchableOpacity onPress={() => increaseCountLike()}>
        <MaterialIcons
          name="thumb-up"
          size={24}
          color={colorLiked}
        />
      </TouchableOpacity>
      <Text style={styles.countText}>{likeCount}</Text>
    </>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    height: 200,
    position: 'relative',
  },
  headerBackground: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  userInfo: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  welcomeText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  searchInput: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  categoryContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  categoryIcon: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  categoryText: {
    fontSize: 12,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#b3cf99',
    padding: 15,
    margin: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  media: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginTop: 10,
  },
  interactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  countText: {
    marginLeft: 5,
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#b3cf99',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginTop: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2f4f2f',
    marginRight: 10,
  },
  searchIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AnnouncementPage;
