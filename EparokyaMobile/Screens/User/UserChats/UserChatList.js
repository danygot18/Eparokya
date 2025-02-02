import React, { useEffect, useState } from 'react';
import { View, FlatList, Pressable, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import baseURL from '../../../assets/common/baseUrl';


const UserChatList = () => {
    const { user, token } = useSelector((state) => state.auth); 
    const [chats, setChats] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const navigation = useNavigation(); 

    useEffect(() => {
        const getChatUsers = async () => {
            if (!user?._id) return;
            try {
                const { data } = await axios.get(`${baseURL}/chat/getAllMessage/${user._id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log(data.users)
                setChats(data?.users || []);
            } catch (err) {
                console.error('Error fetching chat users:', err);
            } finally {
                setLoading(false); 
            }
        };
        setLoading(false);
        getChatUsers();
        console.log(getChatUsers())
    }, [user?._id, token]);

    
    return (
        <View style={styles.container}>
            {loading ? (
                <Text style={styles.loadingText}>Loading chats...</Text>
            ) : chats.length > 0 ? (
                <FlatList
                    data={chats}
                    renderItem={({ item, index }) => (
                        <Pressable
                            onPress={() =>
                                navigation.navigate('UserChat', {
                                    userId: item.id
                                })
                            }
                            style={styles.chatItem}
                        >
                            <View style={styles.chatInfo}>
                                <Text style={styles.username}>{item.email}</Text>
                                <Text style={styles.lastMessage}>
                                    {item.lastMessage || 'No messages yet.'} {/* Use item.lastMessage */}
                                </Text>
                            </View>
                        </Pressable>
                    )}
                    keyExtractor={(item, index) => item?.id || `chat-${index}`} 
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