import React, { useState, useCallback, useRef } from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import baseURL from '../../../assets/common/baseUrl';
import Animated, { FadeIn } from 'react-native-reanimated';

const UserChatList = () => {
    const { user, token } = useSelector((state) => state.auth);
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();


    const getChatUsers = async () => {
        if (!user?._id) return;
        try {
            const { data } = await axios.get(`${baseURL}/chat/getAllMessage/${user._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Chat users:', data.users);
            setChats(Array.isArray(data?.users) ? data.users : []);
        } catch (err) {
            console.error('Error fetching chat users:', err);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getChatUsers();
        }, [user?._id, token])
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <Text style={styles.loadingText}>Loading chats...</Text>
            ) : chats.length > 0 ? (
                <Animated.FlatList
                    data={chats}
                    keyExtractor={(item) => item.id.toString()} // Ensure key is a string
                    renderItem={({ item }) => (
                        <Animated.View entering={FadeIn.duration(300)}>
                            <Pressable
                                onPress={() =>
                                    navigation.navigate('UserChat', {
                                        userId: item.id,
                                        email: item.email,
                                    })
                                }
                                style={styles.chatItem}
                            >
                                <View style={styles.chatInfo}>
                                    <Text style={styles.username}>{item.name || item.email}</Text>
                                    <Text style={styles.timestamp}>
                                        Last message: {new Date(item?.lastMessageAt || Date.now()).toLocaleString()}
                                    </Text>
                                </View>
                            </Pressable>
                        </Animated.View>
                    )}
                />
            ) : (
                <Text style={styles.emptyText}>No chats available.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 20,
    },
    chatItem: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    chatInfo: {
        flex: 1,
    },
    username: {
        fontWeight: 'bold',
    },
    lastMessage: {
        color: '#666',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
    },
});

export default UserChatList;
