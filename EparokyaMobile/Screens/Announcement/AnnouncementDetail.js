import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import SyncStorage from 'sync-storage';
import { useFocusEffect } from '@react-navigation/native';
import baseURL from '../../assets/common/baseUrl';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const AnnouncementDetail = ({ route, navigation }) => {
  const { announcementId } = route.params;

  const [announcement, setAnnouncement] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [replyTexts, setReplyTexts] = useState({}); // store reply texts by comment ID

  const { user, token } = useSelector(state => state.auth);

  const fetchAnnouncementAndComments = async () => {
    setLoading(true);
    try {
      const announcementResponse = await axios.get(`${baseURL}/getAnnouncement/${announcementId}`);
      setAnnouncement(announcementResponse.data);

      const commentsResponse = await axios.get(`${baseURL}/comments/${announcementId}`);
      setComments(commentsResponse.data);
      console.log(commentsResponse.data)

      console.log('Announcement:', announcementId);
    } catch (error) {
      console.error('Error fetching announcement or comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAnnouncementAndComments();
      
    }, [announcementId])
  );

  const handleAction = async (url, method, body = null, successMessage, errorMessage) => {
    
    if (!token) {
      Toast.show({ type: 'error', text1: 'Login Required', text2: 'Please log in to perform this action.' });
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios[method](url, body, config);
      return response.data;
    } catch (error) {
      console.error(errorMessage, error);
      Toast.show({ type: 'error', text1: 'Error', text2: errorMessage });
      throw error;
    }
  };

  const handleLike = async () => {
    try {
      const data = await handleAction(
        `${baseURL}/announcement/like/${announcementId}`,
        'put',
        null,
        'Like status updated!',
        'Unable to update like status.'
      );
      setAnnouncement((prev) => ({ ...prev, likedBy: data.likedBy }));
      fetchAnnouncementAndComments();
    } catch { }
  };

  const handleComment = async () => {
    try {
      const response = await handleAction(
        `${baseURL}/AnnouncementComment/comment/${announcementId}`,
        'post',
        { text: commentText },
        'Comment added!',
        'Error posting comment.'
      );
      setComments((prevComments) => [...prevComments, response]);
      fetchAnnouncementAndComments();
      
      
      setCommentText('');
    } catch { }
  };

  const handleReply = async (commentId) => {
    const replyText = replyTexts[commentId];
    if (!replyText) return;

    try {
      const response = await handleAction(
        `${baseURL}/AnnouncementComment/comment/reply/${commentId}`,
        'post',
        { text: replyText },
        'Reply added!',
        'Error posting reply.'
      );
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? { ...comment, replies: [...comment.replies, response] }
            : comment
        )
      );
      setReplyTexts((prev) => ({ ...prev, [commentId]: '' }));
      fetchAnnouncementAndComments();
    } catch { }
  };

  const handleLikeToggle = async (commentId) => {
    const comment = comments.find((c) => c._id === commentId);
    const isLiked = comment.likedBy?.includes(user?._id);

    try {
      const updatedComment = await handleAction(
        `${baseURL}/AnnouncementComment/comment/${isLiked ? 'unlike' : 'like'}/${commentId}`,
        'post',
        null,
        'Like status updated!',
        'Unable to update like status.'
      );

      setComments((prevComments) =>
        prevComments.map((c) => (c._id === commentId ? updatedComment : c))
      );
      fetchAnnouncementAndComments();
    } catch { }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <MaterialIcons name="arrow-back" size={24} color="black" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {announcement ? (
        <>
          <Text style={styles.title}>{announcement.name || 'No Title Available'}</Text>
          <Text>{announcement.description || 'No Description Available'}</Text>
          <Text>{announcement.richDescription || 'No Details Available'}</Text>
          <Text>Tags: {announcement.tags?.join(', ') || 'No Tags'}</Text>
          {announcement.image ? (
            <Image source={{ uri: announcement.image }} style={styles.image} />
          ) : (
            <Text>No Image Available</Text>
          )}
        </>
      ) : (
        <Text>No announcement details found.</Text>
      )}

      <View style={styles.interactionContainer}>
        <TouchableOpacity onPress={handleLike}>
          <MaterialIcons
            name="thumb-up"
            size={24}
            color={announcement?.likedBy?.includes(user?._id) ? 'green' : 'gray'}
          />
        </TouchableOpacity>
        <Text>{announcement?.likedBy?.length || 0}</Text>
      </View>

      {comments.map((comment) => (
        <View key={comment._id} style={styles.comment}>
          <View style={styles.commentHeader}>
            <Text style={styles.commentUser}>{comment.user?.name || 'Anonymous'}:</Text>
            <Text style={styles.commentDate}>{new Date(comment.dateCreated).toLocaleString()}</Text>
          </View>
          <Text style={styles.commentText}>{comment.text}</Text>

          <View style={styles.commentActions}>
            <Text style={styles.replies}>{comment.replies?.length || 0} Replies</Text>
            <TouchableOpacity onPress={() => handleLikeToggle(comment._id)}>
              <MaterialIcons
                name="thumb-up"
                size={20}
                color={comment.likedBy?.includes(user?._id) ? 'green' : 'gray'}
              />
            </TouchableOpacity>
            <Text>{comment.likedBy?.length || 0} Likes</Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              const currentReplyText = replyTexts[comment._id] || '';
              setReplyTexts((prev) => ({ ...prev, [comment._id]: currentReplyText }));
            }}>
            <Text style={styles.replyButton}> Add Reply</Text>
          </TouchableOpacity>

          {replyTexts[comment._id] !== undefined && (
            <View style={styles.replyInputContainer}>
              <TextInput
                value={replyTexts[comment._id]}
                onChangeText={(text) => setReplyTexts((prev) => ({ ...prev, [comment._id]: text }))}
                placeholder="Add a reply"
                style={styles.input}
              />
              <TouchableOpacity onPress={() => handleReply(comment._id)}>
                <Text style={styles.postButton}>Submit</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Displaying replies */}
          {comment.replies?.map((reply, index) => (
            <View key={reply._id || index} style={styles.reply}>
              <Text style={styles.replyUser}>{reply.user?.name || 'Anonymous'}:</Text>
              <Text style={styles.replyText}>{reply.text}</Text>
            </View>
          ))}
        </View>
      ))}

      {/* Leave a comment section */}
      <TextInput
        value={commentText}
        onChangeText={setCommentText}
        placeholder="Leave a comment"
        style={styles.input}
      />
      <TouchableOpacity onPress={handleComment} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit Comment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
  interactionContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  input: { borderWidth: 1, padding: 8, marginVertical: 8, borderRadius: 4 },
  comment: { borderBottomWidth: 1, paddingVertical: 8, marginBottom: 8 },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  commentUser: { fontWeight: 'bold' },
  commentDate: { color: 'gray' },
  commentText: { marginVertical: 4 },
  commentActions: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 },
  replies: { color: '#1C5739' },
  replyButton: { color: '#1C5739', marginTop: 4 },
  replyInputContainer: { marginTop: 16 },
  reply: { marginLeft: 16, marginTop: 8 },
  replyUser: { fontWeight: 'bold' },
  replyText: { color: 'black' },
  postButton: { color: '#1C5739', marginTop: 8 },
  submitButton: { backgroundColor: '#1C5739', padding: 10, borderRadius: 4, marginTop: 10 },
  submitButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backButtonText: { marginLeft: 8, fontSize: 16 },
  image: { width: '100%', height: 200, marginVertical: 16 },
});

export default AnnouncementDetail;
