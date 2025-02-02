import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";
import Toast from "react-native-toast-message";

const AnnouncementCategoryList = ({ navigation }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${baseURL}/announcementCategory`);
            console.log("Fetched categories response:", response.data);  

            setCategories(response.data); 
            setLoading(false);
        } catch (err) {
            console.error("Error fetching categories:", err.response ? err.response.data : err.message);
            Toast.show({
                topOffset: 60,
                type: "error",
                text1: "Error loading categories",
                text2: "Please try again later",
            });
            setLoading(false);
        }
    };

    const deleteCategory = async (categoryId) => {
        try {
            const response = await axios.delete(`${baseURL}/announcementCategory/delete/${categoryId}`);
            console.log("Delete response:", response.data);

            setCategories(categories.filter(category => category._id !== categoryId));

            Toast.show({
                topOffset: 60,
                type: "success",
                text1: "Category Deleted",
                text2: "The announcement category has been successfully deleted.",
            });
        } catch (err) {
            console.error("Error deleting category:", err.response ? err.response.data : err.message);
            Toast.show({
                topOffset: 60,
                type: "error",
                text1: "Error Deleting Category",
                text2: "Please try again later",
            });
        }
    };

    const confirmDelete = (categoryId) => {
        Alert.alert(
            "Delete Category",
            "Are you sure you want to delete this category?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "OK", onPress: () => deleteCategory(categoryId) },
            ]
        );
    };

    const renderCategory = ({ item }) => (
        <View style={styles.card}>
            {item.image ? (
                <Image source={{ uri: item.image }} style={styles.image} />
            ) : (
                <View style={styles.imagePlaceholder} />
            )}
            <View style={styles.content}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
            <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={() => confirmDelete(item._id)}
            >
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#1C5739" />
            ) : (
                <FlatList
                    data={categories}
                    renderItem={renderCategory}
                    keyExtractor={(item) => item._id}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#fff",
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#f8f8f8",
        borderRadius: 10,
        marginVertical: 8,
        padding: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
        justifyContent: "space-between",
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 5,
        marginRight: 10,
    },
    imagePlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 5,
        marginRight: 10,
        backgroundColor: "#ccc",
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    description: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
    },
    deleteButton: {
        backgroundColor: "#FF6347",  
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default AnnouncementCategoryList;
