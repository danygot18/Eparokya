import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { format } from "date-fns";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import Swiper from "react-native-swiper";
import { Button, Box, VStack, HStack, Avatar, Spinner } from "native-base";
import Toast from "react-native-toast-message";
import baseURL from "../../assets/common/baseUrl";
import { useSelector } from "react-redux";

const AnnouncementDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { announcementId } = route.params;
  const [announcement, setAnnouncement] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [replyTexts, setReplyTexts] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedReplies, setExpandedReplies] = useState({});

  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (announcementId) {
      fetchAnnouncement();
      fetchComments();
    }
  }, [announcementId]);

  const fetchAnnouncement = async () => {
    try {
      const res = await axios.get(`${baseURL}/getAnnouncement/${announcementId}`);
      setAnnouncement(res.data.announcement);
      setLikeCount(res.data.announcement.likedBy.length);
      setLiked(res.data.announcement.likedBy.includes(user._id));
    } catch (error) {
      console.error("Error fetching announcement:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${baseURL}/comments/${announcementId}`);
      setComments(res.data.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const toggleLike = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.put(
        `${baseURL}/likeAnnouncement/${announcementId}`,
        {},
        config
      );
      setLiked(!liked);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const addComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await axios.post(
        `${baseURL}/${announcementId}/announcementComment`,
        { text: commentText },
        { withCredentials: true }
      );
      if (res.data.message.includes("profane word")) {
        Alert.alert("Error", res.data.message);
      } else {
        setComments([...comments, res.data.data]);
        setCommentText("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // const toggleLikeComment = async (commentId) => {
  //   try {
  //     const res = await axios.put(
  //       `${baseURL}/anouncementCommentLike/${commentId}`,
  //       {},
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     setComments((prevComments) =>
  //       prevComments.map((comment) =>
  //         comment._id === commentId
  //           ? { ...comment, likedBy: res.data.data.likedBy }
  //           : comment
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error toggling like on comment:", error);
  //   }
  // };

  const toggleLikeComment = async (commentId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

        const res = await axios.put(
            `${baseURL}/anouncementCommentLike/${commentId}`,
            {},
            config
        );

        setComments(prevComments =>
            prevComments.map(comment =>
                comment._id === commentId
                    ? { ...comment, likedBy: res.data.data.likedBy }
                    : comment
            )
        );
    } catch (error) {
        console.error('Error toggling like on comment:', error);
    }
};

  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const handleReply = async (commentId) => {
    const replyText = replyTexts[commentId];
    if (!replyText) return;

    try {
      const res = await axios.post(
        `${baseURL}/announcementReply/${commentId}`,
        { text: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? { ...comment, replies: [...comment.replies, res.data.data] }
            : comment
        )
      );
      setReplyTexts((prev) => ({ ...prev, [commentId]: "" }));
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  if (loading) return <Spinner size="lg" />;

  return (
    <ScrollView padding={4} backgroundColor="white">
      {announcement ? (
        <VStack space={4}>
          <HStack alignItems="center">
            <Avatar
              size="md"
              source={require("../../assets/EPAROKYA-SYST.png")}
            />
            <VStack ml={3}>
              <Text fontSize="lg" fontWeight="bold">
                Saint Joseph Parish - Taguig
              </Text>
              <Text fontSize="sm" color="gray.500">
              {announcement.createdAt
                  ? format(new Date(announcement.createdAt), "PPP")
                  : "Date not available"}
              </Text>
            </VStack>
          </HStack>

          <Text fontSize="xl" fontWeight="bold" color="#26572E">
            {announcement.name}
          </Text>
          <Text>{announcement.description}</Text>

          {/* Image Slider */}
          {announcement.images.length > 0 && (
            <Swiper style={{ height: 250 }} showsButtons loop>
              {announcement.images.map((img, index) => (
                <Image
                  key={index}
                  source={{ uri: img.url }}
                  style={{ width: "100%", height: 250, borderRadius: 10 }}
                />
              ))}
            </Swiper>
          )}

          {/* Video Section */}
          {announcement.videos.length > 0 &&
            announcement.videos.map((video, index) => (
              <Box key={index} borderRadius="lg" overflow="hidden">
                <Video
                  source={{ uri: video }}
                  useNativeControls
                  style={{ width: "100%", height: 250 }}
                />
              </Box>
            ))}

          <HStack space={3} alignItems="center">
            <TouchableOpacity onPress={toggleLike}>
              <FontAwesome
                name={liked ? "heart" : "heart-o"}
                size={24}
                color={liked ? "red" : "black"}
              />
            </TouchableOpacity>
            <Text>{likeCount} Likes</Text>
          </HStack>

          {/* Comments Section */}
          <VStack space={4}>
            <Text fontSize="lg" fontWeight="bold">
              Comments
            </Text>
            <TextInput
              placeholder="Write a comment..."
              value={commentText}
              onChangeText={setCommentText}
              style={{
                borderWidth: 1,
                borderColor: "gray",
                padding: 10,
                borderRadius: 5,
              }}
            />
            <Button backgroundColor="#26572E" onPress={addComment}>Post Comment</Button>

            {comments.map((comment) => (
              <Box
                key={comment._id}
                borderBottomWidth={1}
                borderBottomColor="gray.200"
                pb={2}
              >
                <HStack space={3} alignItems="center">
                  <Avatar
                    size="sm"
                    source={{ uri: comment.user.avatar?.url }}
                  />
                  <VStack>
                    <Text fontWeight="bold"color="#26572E" >{comment.user.name}</Text>
                    <Text>{comment.text}</Text>
                  </VStack>
                </HStack>

                <HStack space={2} alignItems="center" mt={2}>
                  <TouchableOpacity onPress={() => toggleLikeComment(comment._id)}>
                    <FontAwesome5 name="thumbs-up" size={16} />
                  </TouchableOpacity>
                  <Text>{comment.likedBy.length} Likes</Text>

                  <TouchableOpacity onPress={() => toggleReplies(comment._id)}>
                    <FontAwesome5 name="reply" size={16} />
                  </TouchableOpacity>
                  <Text>{comment.replies.length} Replies</Text>
                </HStack>

                {expandedReplies[comment._id] && (
                  <VStack space={2} mt={2}>
                    {comment.replies.map((reply) => (
                      <HStack key={reply._id} space={3} alignItems="center">
                        <Avatar
                          size="sm"
                          source={{ uri: reply.user.avatar?.url }}
                        />
                        <VStack>
                          <Text fontWeight="bold">{reply.user.name}</Text>
                          <Text>{reply.text}</Text>
                        </VStack>
                      </HStack>
                    ))}
                    <HStack space={2} alignItems="center" mt={2}>
                      <TextInput
                        placeholder="Write a reply..."
                        value={replyTexts[comment._id] || ""}
                        onChangeText={(text) =>
                          setReplyTexts((prev) => ({ ...prev, [comment._id]: text }))
                        }
                        style={{
                          borderWidth: 1,
                          borderColor: "gray",
                          padding: 10,
                          borderRadius: 5,
                          flex: 1,
                        }}
                      />
                      <Button backgroundColor="#26572E" onPress={() => handleReply(comment._id)}>Reply</Button>
                    </HStack>
                  </VStack>
                )}
              </Box>
            ))}
          </VStack>
        </VStack>
      ) : (
        <Text>Announcement not found.</Text>
      )}
    </ScrollView>
  );
};

export default AnnouncementDetails;