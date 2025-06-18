import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import * as Notifications from "expo-notifications";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { socket } from "../socket";
import baseURL from "../assets/common/baseUrl";
import { format } from 'date-fns'; // For date formatting

const NotificationUser = ({ user }) => {
    const [notifications, setNotifications] = useState([]);
    const navigation = useNavigation();

    // Fetch Notifications from API
    const fetchNotifications = useCallback(async () => {
        try {
            const response = await axios.get(`${baseURL}/notifications`, {
                withCredentials: true,
            });
            // Sort notifications by date (newest first)
            const sortedNotifications = (response.data || []).sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt));
            setNotifications(sortedNotifications);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    }, []);

    // Handle Notification Click
    const handleNotificationClick = (prayerRequestId) => {
        navigation.navigate("PrayerDetails", { id: prayerRequestId });
    };

    // Format date to be more readable
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return format(date, 'MMM d, yyyy - h:mm a');
        } catch (e) {
            return '';
        }
    };

    // Listen for Real-time Notifications
    useEffect(() => {
        socket.connect();
        fetchNotifications();

        socket.on("push-notification-user", (data) => {
            Notifications.scheduleNotificationAsync({
                content: {
                    title: "New Notification",
                    body: data.message,
                    data: { id: data.N_id },
                },
                trigger: null,
            });

            // Add new notification to the top of the list
            setNotifications(prev => [
                { 
                    ...data,
                    createdAt: new Date().toISOString() // Add current timestamp for new notifications
                },
                ...prev
            ]);
        });

        return () => {
            socket.off("push-notification-user");
            socket.disconnect();
        };
    }, [fetchNotifications]);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Notifications</Text>
            {notifications.length > 0 ? (
                <FlatList
                    data={notifications}
                    keyExtractor={(item, index) => (item?.N_id ? item.N_id.toString() : index.toString())}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.notificationItem}
                            onPress={() => handleNotificationClick(item.N_id)}
                        >
                            <Text style={styles.notificationMessage}>{item.message}</Text>
                            {item.createdAt && (
                                <Text style={styles.notificationDate}>
                                    {formatDate(item.createdAt)}
                                </Text>
                            )}
                        </TouchableOpacity>
                    )}
                    style={styles.notificationList}
                />
            ) : (
                <Text style={styles.noNotifications}>No notifications available</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        borderRadius: 8,
        padding: 10,
        width: '90%',
        maxWidth: 400,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        alignSelf: "center",
        marginTop: 20,
        maxHeight: '80%',
    },
    header: {
        fontWeight: "bold",
        marginBottom: 15,
        fontSize: 18,
        textAlign: "center",
        color: '#333',
    },
    notificationList: {
        width: '100%',
    },
    notificationItem: {
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    notificationMessage: {
        fontSize: 15,
        color: '#333',
        marginBottom: 4,
    },
    notificationDate: {
        fontSize: 12,
        color: '#888',
        fontStyle: 'italic',
    },
    noNotifications: {
        textAlign: "center",
        color: "gray",
        paddingVertical: 20,
        fontSize: 16,
    },
});

export default NotificationUser;