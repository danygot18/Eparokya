import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import baseURL from "../../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import mime from "mime";

const Announcement = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [richDescription, setRichDescription] = useState('');
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [tags, setTags] = useState('');
    const [comment, setComment] = useState('');
    const [likes, setLikes] = useState(0);
    const [userId, setUserId] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${baseURL}/announcementCategory`);
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const pickVideo = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setVideo(result.assets[0].uri);
        }
    };

    const submitAnnouncement = async () => {
        const formData = new FormData();

        formData.append('name', name);
        formData.append('description', description);
        formData.append('richDescription', richDescription);
        formData.append('category', selectedCategory); 

        if (image) {
            const imageUri = image;
            const fileType = mime.getType(imageUri);
            const fileName = imageUri.split('/').pop();
            formData.append('image', {
                uri: imageUri,
                type: fileType,
                name: fileName,
            });
        }

        if (video) {
            const videoUri = video;
            const fileType = mime.getType(videoUri);
            const fileName = videoUri.split('/').pop();
            formData.append('video', {
                uri: videoUri,
                type: fileType,
                name: fileName,
            });
        }

        const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        formData.append('tags', tagArray.join(','));

        try {
            const response = await axios.post(`${baseURL}/announcement/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Response:', response.data);
            Toast.show({
                type: 'success',
                position: 'top',
                text1: 'Announcement Created Successfully!',
                visibilityTime: 4000,
            });
            setName('');
            setDescription('');
            setRichDescription('');
            setTags('');
            setImage(null);
            setVideo(null);
        } catch (error) {
            console.error('Error in submission:', error);
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Failed to Create Announcement',
                visibilityTime: 4000,
            });
        }
    };

    const unlikeAnnouncement = async (announcementId) => {
        try {
            const response = await axios.post(`${baseURL}/api/v1/announcement/unlike`, { announcementId, userId });
            if (response.data) {
                setLikes(prevLikes => prevLikes - 1);
            }
        } catch (error) {
            console.error('Error unliking announcement:', error);
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Create Announcement</Text>

            <TextInput
                placeholder="Announcement Name"
                value={name}
                onChangeText={setName}
                style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
            />
            <TextInput
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
            />
            <TextInput
                placeholder="Rich Description"
                value={richDescription}
                onChangeText={setRichDescription}
                style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
            />

            <Text>Category</Text>
            <Picker
                selectedValue={selectedCategory}
                onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                style={{ height: 50, width: '100%', marginVertical: 10 }}
            >
                {categories.map((category) => (
                    <Picker.Item key={category._id} label={category.name} value={category._id} />
                ))}
            </Picker>

            <Button title="Pick Image" onPress={pickImage} />
            {image && <Image source={{ uri: image }} style={{ width: 100, height: 100, marginVertical: 10 }} />}

            <Button title="Pick Video" onPress={pickVideo} />
            {video && <Text>Video Selected</Text>}

            <TextInput
                placeholder="Tags (comma separated)"
                value={tags}
                onChangeText={setTags}
                style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
            />

            <Button title="Submit Announcement" onPress={submitAnnouncement} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 }}>
                <Text>Likes: {likes}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => likeAnnouncement('announcementId')}>
                        <Text style={{ marginRight: 10 }}>Like</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => unlikeAnnouncement('announcementId')}>
                        <Text>Unlike</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default Announcement;
