import React, { useCallback, useEffect, useState } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { useTheme, Text } from 'react-native-paper'
import Icon from "react-native-vector-icons/Ionicons";
import { GiftedChat, Bubble, InputToolbar, Send } from "react-native-gifted-chat";
import { useSelector } from 'react-redux';
import axios from 'axios';
import baseURL from '@/assets/common/baseUrl';
import { socket } from '@/socket';
import hideTabBar from '@/Utils/hideTabBar';
import { useNavigation } from '@react-navigation/native'

const { height } = Dimensions.get("window");

export default function Chat({ route }) {

    const appTheme = useTheme()
    const chat = route.params;
    const { user, token } = useSelector(state => state.auth);
    const [messages, setMessages] = useState([]);
    const navigation = useNavigation()

    const getChat = async () => {
        try {

            const { data } = await axios.get(`${baseURL}/chat/${chat._id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            const messages = data.messages.map((message, i) => (
                {
                    _id: message._id,
                    text: message.text_content,
                    createdAt: message.createdAt,
                    user: {
                        _id: message.sender._id,
                        name: message.sender.name,
                        avatar: message.sender?.profile?.avatar?.url,
                    }
                }
            ))

            setMessages(messages)

            // setMessages([
            //     {
            //         _id: 1,
            //         text: 'Hello developer',
            //         createdAt: new Date(),
            //         user: {
            //             _id: 2,
            //             name: 'React Native',
            //             avatar: 'https://placeimg.com/140/140/any',
            //         },
            //     },
            // ])

        } catch (err) {
            console.log(err);
        }
    }

    // TODO: REAL TIME MESSAGE SOCKET

    const sendMessage = async (message) => {
        try {

            const { data } = await axios.post(`${baseURL}/message/send`, {
                participants: [
                    chat.participants?.find(u => u._id !== user._id)?._id,
                    user._id
                ],
                is_group: false,
                sender: user._id,
                text_content: message,
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

        } catch (err) {
            console.log(err);
        }
    }

    const pushMessage = (message) => {
        socket.emit("send-message", {
            id: chat.participants?.find(u => u._id !== user._id)?._id,
            message: {
                _id: Date.now(),
                text: message,
                createdAt: Date.now(),
                user: {
                    _id: user._id,
                    name: user.username,
                    avatar: user?.profile?.avatar?.url,
                }
            }
        })
    }

    const onSend = useCallback((messages = []) => {
        sendMessage(messages[0].text);

        pushMessage(messages[0].text);

        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, messages)
        );
    }, []);

    const renderInputToolBar = (props) => {
        return (
            <InputToolbar
                {...props}
                wrapperStyle={{ marginBotton: 20 }}
                containerStyle={{
                    borderRadius: 16,
                    backgroundColor: appTheme.colors.background,
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

        socket.on("push-message", (data) => {
            console.log(data)
            setMessages((previousMessages) =>
                GiftedChat.append(previousMessages, [data.message])
            );
        })

        return () => {
            socket.off('push-message')
        }

    }, []);

    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    left: {
                        backgroundColor: appTheme.colors.tertiary,
                    },
                    right: {
                        backgroundColor: "#0075FD",
                    },
                }}
            />
        );
    };

    useEffect(() => {
        hideTabBar(navigation, appTheme);
    }, [navigation]);

    return (
        <View style={{
            flex: 1,
            backgroundColor: appTheme.colors.background,
        }}>
            <View style={{
                paddingHorizontal: 8,
                borderBottomWidth: 1,
                borderBottomColor: "#DDDDDD",
                paddingVertical: 8,
            }}>
                <Text style={{
                    fontWeight: "500",
                    paddingLeft: 16,
                    fontSize: 18,
                    textAlign: 'center'
                }}>
                    {chat.participants?.find(u => u._id !== user._id)?.username}
                </Text>
            </View>

            <GiftedChat
                messages={messages}
                onSend={(messages) => onSend(messages)}
                user={{
                    _id: user._id,
                }}
                textInputStyle={{
                    color: appTheme.colors.onBackground, // Change to your desired color
                }}
                renderAvatar={null}
                renderUsernameOnMessage={false}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolBar}
                renderSend={renderSend}
            />
            <View style={{ marginBottom: 10 }}></View>
        </View>
    )
}