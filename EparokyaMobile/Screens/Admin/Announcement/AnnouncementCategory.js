import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import baseURL from "../../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import mime from "mime"; 

const AnnouncementCategory = () => {
  const [category, setCategory] = useState({
    name: '',
    description: '',
    images: [],  
  });

  const [imagesPreview, setImagesPreview] = useState([]);  

  const handleChange = (name, value) => {
    setCategory({ ...category, [name]: value });
  };

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      console.log('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,  
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setImagesPreview([selectedImage.uri]); 
      setCategory({ ...category, images: [selectedImage] });  
    }
  };

  const submitForm = async () => {
    const formData = new FormData();
    formData.append('name', category.name);
    formData.append('description', category.description);

    if (category.images[0]) {
      const imageUri = category.images[0].uri;
      const fileType = mime.getType(imageUri);  
      const fileName = imageUri.split('/').pop();  
      formData.append('image', {
        uri: imageUri,
        type: fileType,
        name: fileName,
      });
    }

    try {
      const response = await axios.post(`${baseURL}/announcementCategory/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',  
        },
      });
      console.log('Response:', response.data);
      Toast.show({ text1: 'Announcement Category Created Successfully!' });

      setCategory({ name: '', description: '', images: [] });
      setImagesPreview([]);
    } catch (error) {
      console.error('Error uploading image', error);
      Toast.show({
        text1: 'Error uploading image',
        text2: error.message,
      });
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Create Announcement Category</Text>

      <TextInput
        placeholder="Name"
        value={category.name}
        onChangeText={(value) => handleChange('name', value)}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />

      <TextInput
        placeholder="Description"
        value={category.description}
        onChangeText={(value) => handleChange('description', value)}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />

      <Button title="Pick Image" onPress={handleImagePick} />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {imagesPreview.map((img, index) => (
          <Image key={index} source={{ uri: img }} style={{ width: 100, height: 100, margin: 5 }} />
        ))}
      </View>

      <Button title="Create Announcement Category" onPress={submitForm} />
    </View>
  );
};

export default AnnouncementCategory;
