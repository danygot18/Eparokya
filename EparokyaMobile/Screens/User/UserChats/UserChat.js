import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Avatar, Icon } from 'react-native-elements';
import { socket } from '../../../socket/index';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import baseURL from '../../../assets/common/baseUrl';
import axios from 'axios';
import moment from 'moment'; // For date formatting

const UserChat = ({ route }) => {
  const { userId, email } = route.params; // Ensure userId is passed correctly

  const { user, token } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  const getChat = async () => {
    try {
      const { data } = await axios.get(`${baseURL}/chat/getMessage/${userId}/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedMessages = data.messages.map((chat) => ({
        _id: chat._id,
        text: chat.message,
        createdAt: chat.createdAt,
        user: {
          _id: chat.sender._id,
          name: chat.sender.name,
          avatar: chat.sender?.profile?.avatar?.url,
        },
      }));

      setMessages(formattedMessages.reverse()); // Reverse to show latest messages at the bottom
    } catch (err) {
      console.log('getchat error', err);
    }
  };

  const sendChat = async (message) => {
    try {
      const data = await axios.post(
        `${baseURL}/chat/sendMessage`,
        {
          userId,
          senderId: user?._id,
          message: message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('success');
    } catch (err) {
      console.log('send chat', err);
    }
  };

  const pushChat = (chat) => {
    socket.emit('send-chat', {
      id: userId,
      message: {
        _id: Date.now(),
        text: chat,
        createdAt: Date.now(),
        user: {
          _id: user._id,
          name: user.username,
          avatar: user.sender?.profile?.avatar?.url,
        },
      },
    });
  };

  const onSend = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        _id: Date.now(),
        text: inputMessage,
        createdAt: new Date(),
        user: {
          _id: user._id,
          name: user.username,
          avatar: user.sender?.profile?.avatar?.url,
        },
      };

      sendChat(inputMessage);
      pushChat(inputMessage);
      setMessages((previousMessages) => [...previousMessages, newMessage]); // Append new message
      setInputMessage('');
      flatListRef.current.scrollToEnd({ animated: true }); // Scroll to the latest message
    }
  };

  useEffect(() => {
    getChat();
    socket.on('push-message', (data) => {
      const { message } = data;
      setMessages((previousMessages) => [...previousMessages, message]);
    });

    socket.emit('join', { userId: user._id });

    return () => {
      socket.off('push-message');
    };
  }, []);

  const renderMessage = ({ item, index }) => {
    const isMyMessage = item.user._id === user._id;
    const previousMessage = messages[index - 1];
    const showDate = !previousMessage || !moment(item.createdAt).isSame(previousMessage.createdAt, 'day');

    return (
      <View>
        {showDate && (
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              {moment(item.createdAt).isSame(moment(), 'day') ? 'Today' : moment(item.createdAt).format('MMMM D')}
            </Text>
          </View>
        )}
        <View
          style={[
            styles.messageContainer,
            isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer,
          ]}
        >
          <View
            style={[
              styles.messageBubble,
              isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.messageTime}>{moment(item.createdAt).format('h:mm A')}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{email}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={inputMessage}
            onChangeText={setInputMessage}
            multiline
          />
          <TouchableOpacity onPress={onSend} style={styles.sendButton}>
            <Icon name="send" size={24} color="#0075FD" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
    paddingVertical: 8,
    backgroundColor: '#f9f9f9',
  },
  headerText: {
    fontWeight: '500',
    paddingLeft: 16,
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
  },
  messagesList: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'flex-end',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 10,
  },
  myMessageBubble: {
    backgroundColor: '#0075FD',
    marginLeft: '30%',
  },
  otherMessageBubble: {
    backgroundColor: '#F3F3F3',
    marginRight: '30%',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#DDDDDD',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
});

export default UserChat;