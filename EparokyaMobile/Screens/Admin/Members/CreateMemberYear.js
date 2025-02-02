import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import baseURL from "../../../assets/common/baseUrl";

const CreateMemberYear = () => {
    const [categories, setCategories] = useState([]);
    const [years, setYears] = useState([]);
    const [form, setForm] = useState({
        name: '',
        startYear: '',
        endYear: ''
    });
    const [editId, setEditId] = useState(null);
    const [originalYears, setOriginalYears] = useState({ startYear: '', endYear: '' });

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const yearsList = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => (1900 + i).toString());
        setYears(yearsList);
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${baseURL}/memberYear/`);
            setCategories(response.data.data || []);
        } catch (error) {
            console.error('Error fetching categories:', error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        if (!form.name.trim() || !form.startYear || !form.endYear) {
            Alert.alert('Error', 'All fields are required.');
            return;
        }

        const parsedStartYear = parseInt(form.startYear, 10);
        const parsedEndYear = parseInt(form.endYear, 10);

        if (isNaN(parsedStartYear) || isNaN(parsedEndYear)) {
            Alert.alert('Error', 'Please select valid years.');
            return;
        }

        if (parsedStartYear >= parsedEndYear) {
            Alert.alert('Error', 'End year must be greater than start year.');
            return;
        }

        const payload = {
            name: form.name,
        };

        if (form.startYear || form.endYear) {
            payload.yearRange = {
                ...(form.startYear && { startYear: parseInt(form.startYear, 10) }),
                ...(form.endYear && { endYear: parseInt(form.endYear, 10) }),
            };
        }



        console.log('Form Data:', form);
        console.log('Payload being sent:', payload);

        try {
            const endpoint = editId
                ? `${baseURL}/memberYear/edit/${editId}`
                : `${baseURL}/memberYear/create`;

            const method = editId ? axios.put : axios.post;

            const response = await method(endpoint, payload);
            Alert.alert('Success', response.data.message);
            fetchCategories();
            resetForm();
        } catch (error) {
            console.error('Error submitting form:', error.response?.data || error.message);
            Alert.alert('Error', error.response?.data?.message || 'Server Error');
        }
    };


    const resetForm = () => {
        setForm({ name: '', startYear: '', endYear: '' });
        setOriginalYears({ startYear: '', endYear: '' });
        setEditId(null);
    };

    const handleEdit = (category) => {
        setEditId(category._id);
        setForm({
            name: category.name || '',
            startYear: category.yearRange?.startYear?.toString() || '',
            endYear: category.yearRange?.endYear?.toString() || ''
        });
        setOriginalYears({
            startYear: category.yearRange?.startYear?.toString() || 'N/A',
            endYear: category.yearRange?.endYear?.toString() || 'N/A'
        });
    };

    const handleDelete = async (id) => {
        Alert.alert('Confirm', 'Are you sure you want to delete this category?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                onPress: async () => {
                    try {
                        const response = await axios.delete(`${baseURL}/memberYear/delete/${id}`);
                        Alert.alert('Success', response.data.message);
                        fetchCategories();
                    } catch (error) {
                        console.error('Error deleting category:', error.response?.data?.message || error.message);
                    }
                }
            }
        ]);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Manage Member Year Batch Categories</Text>
            <View style={styles.formGroup}>
                <Text style={styles.label}>Batch Name</Text>
                <TextInput
                    style={styles.input}
                    value={form.name}
                    placeholder="Enter batch name"
                    onChangeText={(value) => handleChange('name', value)}
                />
                <Text style={styles.label}>Start Year</Text>
                <Picker
                    selectedValue={form.startYear}
                    onValueChange={(value) => handleChange('startYear', value)}
                    style={styles.picker}
                >
                    <Picker.Item label="Select Start Year" value="" />
                    {years.map((year) => (
                        <Picker.Item key={year} label={year} value={year} />
                    ))}
                </Picker>
                <Text style={styles.label}>End Year</Text>
                <Picker
                    selectedValue={form.endYear}
                    onValueChange={(value) => handleChange('endYear', value)}
                    style={styles.picker}
                >
                    <Picker.Item label="Select End Year" value="" />
                    {years.map((year) => (
                        <Picker.Item key={year} label={year} value={year} />
                    ))}
                </Picker>
                <Button title={editId ? 'Update Category' : 'Create Category'} onPress={handleSubmit} />
            </View>

            <Text style={styles.subtitle}>Existing Categories</Text>
            {categories.length > 0 ? (
                categories.map((category) => (
                    <View key={category._id} style={styles.categoryItem}>
                        <Text>Batch Name: {category.name}</Text>
                        <Text>Start Year: {category.yearRange.startYear}</Text>
                        <Text>End Year: {category.yearRange.endYear}</Text>
                        <View style={styles.buttonGroup}>
                            <Button title="Edit" onPress={() => handleEdit(category)} />
                            <Button title="Delete" onPress={() => handleDelete(category._id)} color="red" />
                        </View>
                    </View>
                ))
            ) : (
                <Text style={styles.noDataText}>No categories found. Create one to get started!</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f9f9f9'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333'
    },
    formGroup: {
        marginBottom: 20
    },
    input: { 
        borderWidth: 1, 
        borderColor: '#ccc', 
        padding: 10, 
        borderRadius: 5, 
        marginBottom: 10, 
        backgroundColor: '#fff' 
    },
    picker: { 
        borderWidth: 1, 
        borderColor: '#ccc', 
        marginBottom: 10 
    },
    label: { 
        fontWeight: 'bold', 
        marginBottom: 5 
    },
    readOnlyText: { 
        padding: 10, 
        borderRadius: 5, 
        backgroundColor: '#eee', 
        color: '#555', 
        marginBottom: 10 
    },
    subtitle: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        marginBottom: 10, 
        color: '#555' 
    },
    categoryItem: { 
        borderWidth: 1, 
        borderColor: '#ccc', 
        padding: 15, 
        borderRadius: 5, 
        marginBottom: 10, 
        backgroundColor: '#fff' 
    },
    buttonGroup: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginTop: 10 
    },
    noDataText: { 
        textAlign: 'center', 
        color: '#888', 
        marginTop: 20 
    }
});

export default CreateMemberYear;
