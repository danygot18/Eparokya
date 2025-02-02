    import React, { useState, useEffect } from 'react';
    import {
        View,
        Text,
        TextInput,
        Button,
        StyleSheet,
        TouchableOpacity,
        Image,
        ScrollView,
        Platform,
    } from 'react-native';
    import * as ImagePicker from 'expo-image-picker';
    import * as DocumentPicker from 'expo-document-picker';
    import { Picker } from '@react-native-picker/picker';
    import axios from 'axios';
    import mime from 'mime';
    import baseURL from "../../../assets/common/baseUrl";
    import Toast from 'react-native-toast-message';

    const CreatePostResource = ({ navigation }) => {
        const [title, setTitle] = useState('');
        const [description, setDescription] = useState('');
        const [richDescription, setRichDescription] = useState('');
        const [image, setImage] = useState(null);
        const [file, setFile] = useState(null);
        const [resourceCategory, setResourceCategory] = useState('');
        const [loading, setLoading] = useState(false);
        const [categories, setCategories] = useState([]);

        useEffect(() => {
            const fetchCategories = async () => {
                try {
                    const response = await axios.get(`${baseURL}/resourceCategory/`);
                    if (Array.isArray(response.data.data)) {
                        setCategories(response.data.data);
                    }
                } catch (error) {
                    console.error('Error fetching categories:', error);
                }
            };
            fetchCategories();
        }, []);

        const handleImagePick = async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled && result.assets.length > 0) {
                setImage(result.assets[0]);
            }
        };

        const handleFileUpload = async () => {
            try {
                const result = await DocumentPicker.getDocumentAsync({
                    type: 'application/pdf', // Restrict to PDFs
                });
        
                if (result.type === 'success') {
                    console.log('PDF selected:', result);
                    setFile({
                        uri: result.uri,
                        name: result.name || 'document.pdf', // Use provided name or fallback
                        type: result.mimeType || 'application/pdf', // Fallback if mimeType is missing
                    });
                } else {
                    console.log('Document selection canceled');
                }
            } catch (error) {
                console.error('Error picking file:', error);
            }
        };
        
        
        // Get platform-specific file path for Android/iOS
        const getPlatformSpecificUri = (uri) => 
            Platform.OS === 'android' ? uri.replace('file://', '') : uri;
        
        const handleSubmit = async () => {
            setLoading(true);
        
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('richDescription', richDescription);
            formData.append('resourceCategory', resourceCategory);
        
            if (image) {
                formData.append('image', {
                    uri: image.uri,
                    type: mime.getType(image.uri) || 'image/jpeg',
                    name: image.uri.split('/').pop(),
                });
            }
        
            if (file) {
                formData.append('file', {
                    uri: file.uri,
                    type: mime.getType(file.uri) || 'application/pdf',
                    name: file.name,
                });
            }
        
            try {
                const response = await axios.post(`${baseURL}/postResource/create`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('Response:', response.data);
                Toast.show({ text1: 'Post Resource Created Successfully!' });
            } catch (error) {
                console.error('Error uploading data:', error.message);
                Toast.show({
                    text1: 'Error',
                    text2: error.response?.data || error.message,
                });
            } finally {
                setLoading(false);
            }
        };
        
          

        return (
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.heading}>Create New Post Resource</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Title"
                    value={title}
                    onChangeText={setTitle}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Description"
                    value={description}
                    onChangeText={setDescription}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Rich Description"
                    value={richDescription}
                    onChangeText={setRichDescription}
                    multiline
                />

                <Text style={styles.label}>Select Resource Category</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={resourceCategory}
                        onValueChange={(value) => setResourceCategory(value)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select a category" value="" />
                        {categories.map((category) => (
                            <Picker.Item key={category._id} label={category.name} value={category._id} />
                        ))}
                    </Picker>
                </View>

                <TouchableOpacity onPress={handleImagePick} style={styles.uploadButton}>
                    <Text style={styles.buttonText}>Upload Image</Text>
                </TouchableOpacity>
                {image && <Image source={{ uri: image.uri }} style={styles.previewImage} />}

                <TouchableOpacity onPress={handleFileUpload} style={styles.uploadButton}>
                    <Text style={styles.buttonText}>Upload PDF</Text>
                </TouchableOpacity>
                {file && <Text style={styles.fileName}>{file.name}</Text>}

                <Button
                    title={loading ? 'Submitting...' : 'Submit Resource'}
                    onPress={handleSubmit}
                    disabled={loading}
                />
            </ScrollView>
        );
    };

    const styles = StyleSheet.create({
        container: { padding: 20 },
        heading: { fontSize: 24, marginBottom: 20 },
        input: { marginBottom: 10, borderWidth: 1, padding: 8 },
        pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 10 },
        picker: { height: 50, width: '100%' },
        uploadButton: { backgroundColor: '#4CAF50', padding: 10, marginBottom: 10 },
        previewImage: { width: 100, height: 100, marginBottom: 10 },
        fileName: { fontSize: 14, color: 'gray' },
    });

    export default CreatePostResource;
