import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import baseURL from "../../../assets/common/baseUrl"; 

const ResourceCategoryAdmin = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [editingId, setEditingId] = useState(null); 

    // Fetch all categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${baseURL}/resourceCategory/`);
                setCategories(response.data.data); // Set data to the categories state
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Handle form submission to create or update a category
    const handleSubmit = async () => {
        if (!name || !description) {
            alert('Please fill in both fields');
            return;
        }

        const categoryData = { name, description };

        try {
            if (editingId) {
                // Update category
                await axios.put(`${baseURL}/resourceCategory/${editingId}`, categoryData);
                setCategories(categories.map(category =>
                    category._id === editingId ? { ...category, name, description } : category
                ));
                alert('Category updated successfully');
            } else {
                // Create new category
                const response = await axios.post(`${baseURL}/resourceCategory/create`, categoryData);
                setCategories([response.data.data, ...categories]);
                alert('Category created successfully');
            }
            setName('');
            setDescription('');
            setEditingId(null); // Reset editing
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Error saving category');
        }
    };

    // Handle delete category
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${baseURL}/resourceCategory/${id}`);
            setCategories(categories.filter(category => category._id !== id));
            alert('Category deleted successfully');
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Error deleting category');
        }
    };

    // Handle edit category
    const handleEdit = (category) => {
        setName(category.name);
        setDescription(category.description);
        setEditingId(category._id); // Set editing ID to the current category
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{editingId ? 'Edit Resource Category' : 'Create Resource Category'}</Text>

            <TextInput
                style={styles.input}
                placeholder="Category Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Category Description"
                value={description}
                onChangeText={setDescription}
            />

            <Button title={editingId ? 'Update Category' : 'Create Category'} onPress={handleSubmit} />

            <FlatList
                data={categories}
                renderItem={({ item }) => (
                    <View style={styles.categoryCard}>
                        <Text style={styles.categoryName}>{item.name}</Text>
                        <Text style={styles.categoryDescription}>{item.description}</Text>
                        <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editButton}>
                            <Text>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteButton}>
                            <Text>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
                keyExtractor={(item) => item._id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingLeft: 8,
        borderRadius: 5,
    },
    categoryCard: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        elevation: 3,
    },
    categoryName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    categoryDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    editButton: {
        backgroundColor: '#4CAF50',
        padding: 8,
        borderRadius: 5,
        marginBottom: 5,
    },
    deleteButton: {
        backgroundColor: '#f44336',
        padding: 8,
        borderRadius: 5,
    },
});

export default ResourceCategoryAdmin;
