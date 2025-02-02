import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { socket } from '../../../socket';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native'
import baseURL from '../../../assets/common/baseUrl';
import { GiftedChat, Bubble, InputToolbar, Send } from "react-native-gifted-chat";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet } from 'react-native';
import axios from 'axios';

const UserChat = ({ route }) => {
    const { userId, email } = route.params; // Ensure userId is passed correctly

    const { user, token } = useSelector(state => state.auth)
    const [messages, setMessages] = useState([]);
    const navigation = useNavigation()

    console.log('userId:', user);
    // console.log('Token:', token);

    const getChat = async () => {
        try {
            const { data } = await axios.get(`${baseURL}/chat/getMessage/${userId}/${user._id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            
            const messages = data.messages.map((chat, i) => (
                {
                    _id: chat._id,
                    text: chat.message,
                    createdAt: chat.createdAt,
                    user: {
                        _id: chat.sender._id,
                        name: chat.sender.name,
                        avatar: chat.sender?.profile?.avatar?.url,

                    }

                }
            ))
            

            setMessages(messages)  
            console.log("data", messages)
            
        } catch (err) {
            console.log("getchat error", err)
        }
    }
    // console.log('API Response:', userId?.email);


    const sendChat = async (message) => {
        try {
            const data = await axios.post(`${baseURL}/chat/sendMessage`, {
                userId: userId,
                senderId: user?._id,
                message: message,
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log("success")

        } catch (err) {
            console.log("send chat", err)
        }
    }

    const pushChat = (chat) => {
        socket.emit("send-chat", {
            id: userId,
            message: {
                _id: Date.now(),
                text: chat,
                createdAt: Date.now(),
                user: {
                    _id: user._id,
                    name: user.username,
                    avatar: user.sender?.profile?.avatar?.url,
                }

            }
        })
    }

    const onSend = useCallback((chat = []) => {
        sendChat(chat[0].text);

        pushChat(chat[0].text);

        setMessages((previousChats) =>
            GiftedChat.append(previousChats, chat)
        );
    }, []);

    const renderInputToolBar = (props) => {
        return (
            <InputToolbar
                {...props}
                wrapperStyle={{ marginBotton: 20 }}
                containerStyle={{
                    borderRadius: 16,
                    backgroundColor: colors.background,
                    marginHorizontal: 8,
                    marginTop: 5,
                    borderTopWidth: 0,
                }}
            />
        );
    };

    const renderSend = (props) => {
        return (
            <Send {...props}>
                <View style={{ marginBottom: 11 }}>
                    <Icon name="send" size={24} color="#0075FD" />
                </View>
            </Send>
        );
    };

    useEffect(() => {

        getChat();

        socket.on("push-chat", (data) => {
            // console.log(data)
            setMessages((previousChats) =>
                GiftedChat.append(previousChats, [data.chat])
            );
        })

        return () => {
            socket.off('push-chat')
        }

    }, []);

    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    left: {
                        backgroundColor: colors.tertiary,
                    },
                    right: {
                        backgroundColor: "#0075FD",
                    },
                }}
            />
        );
    };

    const colors = {
        background: "#FFFFFF", // Replace with your background color
        primary: "#0075FD", // Replace with your primary color
        onBackground: "#333333", // Replace with your text color on background
        tertiary: "#F3F3F3", // Replace with any other color you need
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    {userId.email}
                </Text>
            </View>

            <GiftedChat
                messages={messages}
                onSend={(messages) => onSend(messages)}
                user={{
                    _id: user._id,
                }}
                textInputStyle={styles.textInput}
                renderAvatar={null}
                renderUsernameOnMessage={false}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolBar}
                renderSend={renderSend}
            />
            <View style={styles.footerSpacing}></View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9", // Adjust as per your theme
    },
    header: {
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#DDDDDD",
        paddingVertical: 8,
        backgroundColor: "#f9f9f9", // Optionally match the theme
    },
    headerText: {
        fontWeight: "500",
        paddingLeft: 16,
        fontSize: 18,
        textAlign: "center",
        color: "#333", // Adjust for contrast
    },
    textInput: {
        color: "#000", // Ensure high visibility
    },
    footerSpacing: {
        marginBottom: 10,
    },
});

export default UserChat;
