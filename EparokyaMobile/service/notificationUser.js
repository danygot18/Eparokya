import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // For bell icon
import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import axios from "axios";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Initialize Socket
import { socket } from "../socket";
import baseURL from "../assets/common/baseUrl";

const NotificationUser = ({ user }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [open, setOpen] = useState(false);
    const navigation = useNavigation();

    //  Fetch Notifications from API
    const fetchNotifications = useCallback(async () => {
        try {
            const response = await axios.get(`${baseURL}/notifications`, {
                withCredentials: true,
            });
            setNotifications(response.data || []);
            setUnreadCount(response.data.unreadCount || 0);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    }, []);

    //  Mark Notifications as Read
    const markAllAsRead = async () => {
        try {
            await axios.put(`${baseURL}/notifications/mark-read`, {}, {
                withCredentials: true,
            });
            setUnreadCount(0);
        } catch (error) {
            console.error("Error marking notifications as read:", error);
        }
    };

    // Handle Notification Click
    const handleNotificationClick = (prayerRequestId) => {
        navigation.navigate("PrayerDetails", { id: prayerRequestId });
        setOpen(false);
    };

    //Listen for Real-time Notifications
    useEffect(() => {
        socket.connect();
        fetchNotifications();

        socket.on("push-notification-user", (data) => {
            console.log("New Notification:", data.message);

            // Show Expo Push Notification
            Notifications.scheduleNotificationAsync({
                content: {
                    title: "New Notification",
                    body: data.message,
                    data: { id: data.N_id },
                },
                trigger: null,
            });

            setNotifications((prev) => [
                { N_id: data.N_id, message: data.message },
                ...prev,
            ]);

            setUnreadCount((prev) => prev + 1);
        });

        return () => {
            socket.off("push-notification-user");
            socket.disconnect();
        };
    }, [fetchNotifications]);

    return (
        <View style={styles.container}>

            <TouchableOpacity
                style={styles.bellButton}
                onPress={() => {
                    setOpen(!open);
                    markAllAsRead();
                }}
            >
                <MaterialIcons name="notifications" size={28} color="green" />
                {unreadCount > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{unreadCount}</Text>
                    </View>
                )}
            </TouchableOpacity>


            {open && (
                <View style={styles.dropdown}>
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
                                    <Text>{item.message}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    ) : (
                        <Text style={styles.noNotifications}>No new notifications</Text>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "relative",
    },
    bellButton: {
        position: "relative",
        padding: 10,
    },
    badge: {
        position: "absolute",
        top: 5,
        right: 5,
        backgroundColor: "red",
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    badgeText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },
    dropdown: {
        position: "absolute",
        top: 40,
        right: 0,
        backgroundColor: "white",
        borderRadius: 8,
        padding: 10,
        width: 250,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    header: {
        fontWeight: "bold",
        marginBottom: 5,
    },
    notificationItem: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    noNotifications: {
        textAlign: "center",
        color: "gray",
    },
});

export default NotificationUser;
