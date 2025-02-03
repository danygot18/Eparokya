const mongoose = require('mongoose');
const Chat = require('./../models/chat');
const User = require('./../models/user');

// Controller to send a message and update the last message in the chat
exports.sendMessage = async (req, res, next) => {
    try {
        const { userId, senderId, message } = req.body;

        if (!userId || !senderId || !message) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Save the new chat message
        const chatMessage = new Chat({
            user: new mongoose.Types.ObjectId(userId),
            sender: new mongoose.Types.ObjectId(senderId),
            message: message,
            last_message: message, // Set the last message for the chat
        });

        const savedChat = await chatMessage.save();
        const populatedChat = await savedChat.populate(['user', 'sender']);

        // Update the last message for the conversation
        await Chat.updateMany(
            {
                $or: [
                    { user: new mongoose.Types.ObjectId(userId), sender: new mongoose.Types.ObjectId(senderId) },
                    { user: new mongoose.Types.ObjectId(senderId), sender: new mongoose.Types.ObjectId(userId) },
                ],
            },
            {
                last_message: savedChat._id,
                last_message_delivered_at: new Date(),
            }
        );

        res.status(201).json({ message: "Message sent successfully!", chat: populatedChat });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

// Controller to get all messages between two users
exports.getMessages = async (req, res) => {
    const { userId, senderId } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(senderId)) {
            return res.status(400).json({ error: "Invalid User ID or Sender ID." });
        }

        // Fetch messages between the two users
        const messages = await Chat.find({
            $or: [
                { user: new mongoose.Types.ObjectId(userId), sender: new mongoose.Types.ObjectId(senderId) },
                { user: new mongoose.Types.ObjectId(senderId), sender: new mongoose.Types.ObjectId(userId) },
            ],
        })
            .populate('user', 'name email')
            .populate('sender', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Could not fetch messages." });
    }
};
// exports.getMessages = async (req, res) => {
//     const { userId } = req.params;

//     try {
//         // Validate userId
//         if (!mongoose.Types.ObjectId.isValid(userId)) {
//             return res.status(400).json({ error: "Invalid User ID." });
//         }

//         // Fetch all users (excluding the current user)
//         const users = await User.find({ _id: { $ne: new mongoose.Types.ObjectId(userId) } });

//         // Fetch the last message for each user
//         const usersWithLastMessage = await Promise.all(
//             users.map(async (user) => {
//                 // Find the last message between the current user and the target user
//                 const lastMessage = await Chat.findOne({
//                     $or: [
//                         { user: new mongoose.Types.ObjectId(userId), sender: user._id },
//                         { user: user._id, sender: new mongoose.Types.ObjectId(userId) },
//                     ],
//                 })
//                     .sort({ createdAt: -1 }) // Sort by createdAt in descending order
//                     .limit(1); // Limit to 1 result (the last message)

//                 return {
//                     id: user._id,
//                     name: user.name,
//                     email: user.email,
//                     lastMessage: lastMessage ? lastMessage.message : null, // Include the message content
//                     lastMessageAt: lastMessage ? lastMessage.createdAt : null,
//                 };
//             })
//         );

//         res.status(200).json({ success: true, users: usersWithLastMessage });
//     } catch (error) {
//         console.error("Error fetching users with last message:", error);
//         res.status(500).json({ error: "Could not fetch users with last message." });
//     }
// };

// Controller to get a list of chat users for a specific user
exports.getChatUsers = async (req, res) => {
    const { userId } = req.params;
    console.log(userId)

    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid User ID." });
        }

        const users = await Chat.aggregate([
            {
                $match: {
                    $or: [
                        { user: new mongoose.Types.ObjectId(userId) },
                        { sender: new mongoose.Types.ObjectId(userId) },
                    ],
                },
            },
            {
                $sort: { last_message_delivered_at: -1 }, // Sort by last_message_delivered_at in descending order
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$user", new mongoose.Types.ObjectId(userId)] },
                            then: "$sender",
                            else: "$user",
                        },
                    },
                    lastMessage: { $first: "$last_message" }, // Use the first message after sorting (most recent)
                    lastMessageAt: { $first: "$last_message_delivered_at" }, // Use the first timestamp after sorting
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
            {
                $unwind: "$userDetails",
            },
            {
                $project: {
                    _id: 0,
                    id: "$userDetails._id",
                    name: "$userDetails.name",
                    email: "$userDetails.email",
                    avatar: "$userDetails.profile.avatar.url",
                    lastMessage: 1,
                    lastMessageAt: 1,
                },
            },
            {
                $sort: { lastMessageAt: -1 }, // Sort the final result by lastMessageAt
            },
        ]);

        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error("Error fetching chat users:", error);
        res.status(500).json({ error: "Could not fetch chat users." });
    }
};

// exports.getChatUsers = async (req, res) => {
//     const { userId } = req.params;

//     try {
//         if (!mongoose.Types.ObjectId.isValid(userId)) {
//             return res.status(400).json({ error: "Invalid User ID." });
//         }

//         // Find chats where the user is a participant
//         const chats = await Chat.find({
//             $or: [
//                 { user: mongoose.Types.ObjectId(userId) },
//                 { sender: mongoose.Types.ObjectId(userId) },
//             ],
//         })
//             .populate('user', 'name email profile.avatar.url') // Populate user details
//             .populate('sender', 'name email profile.avatar.url') // Populate sender details
//             .sort({ last_message_delivered_at: -1 }); // Sort by last message delivery time

//         // Transform and deduplicate users
//         const usersMap = new Map();

//         chats.forEach((chat) => {
//             const isCurrentUserSender = chat.sender._id.toString() === userId;

//             const participant = isCurrentUserSender ? chat.user : chat.sender;
//             if (!usersMap.has(participant._id.toString())) {
//                 usersMap.set(participant._id.toString(), {
//                     id: participant._id,
//                     name: participant.name,
//                     email: participant.email,
//                     lastMessage: chat.message, // Use the last_message field
//                     lastMessageAt: chat.last_message_delivered_at || null,
//                 });
//             }
//         });

//         const users = Array.from(usersMap.values());

//         res.status(200).json({ success: true, users });
//     } catch (error) {
//         console.error("Error fetching chat users:", error);
//         res.status(500).json({ error: "Could not fetch chat users." });
//     }
// };





