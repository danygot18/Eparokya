import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, Alert } from 'react-native';
import axios from 'axios';
import baseURL from '../../../assets/common/baseUrl';
import SyncStorage from 'sync-storage';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { useSelector } from 'react-redux';

const AdminAvailableDates = () => {
    const [availableDates, setAvailableDates] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { user, token } = useSelector(state => state.auth);

    const fetchAvailableDates = async () => {
        try {
            
            const response = await axios.get(`${baseURL}/admin/available-dates`, {
                headers: { Authorization: `${token}` }
            });
            setAvailableDates(response.data.availableDates);
        } catch (error) {
            console.error('Error fetching available dates:', error);
            Alert.alert('Error', 'Failed to fetch available dates.');
        }
    };

    const validateDateRange = (start, end) => {
        const startObj = new Date(start);
        const endObj = new Date(end);
        return isBefore(startObj, endObj);
    };

    const addAvailableDateRange = async () => {
        if (!validateDateRange(startDate, endDate)) {
            Alert.alert('Invalid Date Range', 'Start date must be before end date.');
            return;
        }

        const newAvailableDates = [];
        let currentDate = new Date(startDate);

        while (currentDate <= new Date(endDate)) {
            newAvailableDates.push(format(currentDate, 'yyyy-MM-dd'));
            currentDate = addDays(currentDate, 1);
        }

        try {
            
            await axios.post(`${baseURL}/admin/available-dates/range`, { dates: newAvailableDates }, {
                headers: { Authorization: `${token}` }
            });
            setStartDate('');
            setEndDate('');
            fetchAvailableDates();
        } catch (error) {
            console.error('Error adding available date range:', error);
            Alert.alert('Error', 'Failed to add the date range.');
        }
    };

    useEffect(() => {
        fetchAvailableDates();
    }, []);

    return (
        <View>
            <TextInput
                value={startDate}
                onChangeText={setStartDate}
                placeholder="Enter start date (YYYY-MM-DD)"
            />
            <TextInput
                value={endDate}
                onChangeText={setEndDate}
                placeholder="Enter end date (YYYY-MM-DD)"
            />
            <Button title="Add Date Range" onPress={addAvailableDateRange} />
            <FlatList
                data={availableDates}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.weddingDate}</Text>
                        <Button title="Remove" onPress={() => deleteAvailableDate(item._id)} />
                    </View>
                )}
                keyExtractor={item => item._id}
            />
        </View>
    );
};

export default AdminAvailableDates;
