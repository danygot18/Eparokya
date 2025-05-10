const { Announcement, Comment, Reply } = require('../../models/Announcement/announcement');
const mongoose = require('mongoose');
const leoProfanity = require('leo-profanity');

exports.addComment = async (req, res) => {
    const { announcementId } = req.params;
    const { text } = req.body;
    const userId = req.user?.id; 

    if (leoProfanity.check(text)) {
        return res.status(400).json({ message: 'Sorry, but your comment contains a profane message.' });
    }

    if (!text || text.trim() === '') {
        return res.status(400).json({ message: 'Comment text cannot be empty.' });
    }

    if (!announcementId) {
        return res.status(400).json({ message: 'Announcement ID is required.' });
    }

    try {
        const comment = new Comment({
            announcement: announcementId,
            user: userId,
            text,
        });

        await comment.save();

        await Announcement.findByIdAndUpdate(
            announcementId,
            {
                $push: { comments: comment._id },
                $inc: { commentsCount: 1 },
            },
            { new: true } 
        );

        const populatedComment = await comment.populate('user', 'name');

        res.status(201).json({ 
            message: 'Comment added successfully', 
            data: populatedComment 
        });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Failed to add comment', error });
    }
};


exports.addReply = async (req, res) => {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user?.id;

    if (leoProfanity.check(text)) {
        return res.status(400).json({ message: 'Sorry, but your comment contains a profane message.' });
    }
    
    try {
        const reply = new Reply({
            user: userId,
            text,
        });

        await reply.save();

        await Comment.findByIdAndUpdate(commentId, { $push: { replies: reply._id } });

        res.status(201).json({ message: 'Reply added successfully', data: reply });
    } catch (error) {
        console.error('Error adding reply:', error);
        res.status(500).json({ message: 'Failed to add reply', error });
    }
};


exports.updateCommentOrReply = async (req, res) => {
    const { id } = req.params;
    const { text, type } = req.body; 
    try {
        const model = type === 'reply' ? Reply : Comment;
        const entity = await model.findByIdAndUpdate(id, { text }, { new: true });

        if (!entity) {
            return res.status(404).json({ message: `${type} not found` });
        }

        res.status(200).json({ message: `${type} updated successfully`, data: entity });
    } catch (error) {
        console.error(`Error updating ${type}:`, error);
        res.status(500).json({ message: `Failed to update ${type}`, error });
    }
};

exports.deleteCommentOrReply = async (req, res) => {
    const { id } = req.params; 
    const { type, parentId } = req.body; 

    try {
        const model = type === 'reply' ? Reply : Comment;
        const entity = await model.findByIdAndDelete(id);

        if (!entity) {
            return res.status(404).json({ message: `${type} not found` });
        }
        if (type === 'reply') {
            await Comment.findByIdAndUpdate(parentId, { $pull: { replies: id } });
        } else {
            await Announcement.findByIdAndUpdate(entity.announcement, { $inc: { commentsCount: -1 } });
        }

        res.status(200).json({ message: `${type} deleted successfully` });
    } catch (error) {
        console.error(`Error deleting ${type}:`, error);
        res.status(500).json({ message: `Failed to delete ${type}`, error });
    }
};

exports.getCommentsWithReplies = async (req, res) => {
    const { announcementId } = req.params;

    try {
        const comments = await Comment.find({ announcement: announcementId })
            .populate('user', 'name avatar') 
            .populate({
                path: 'replies',
                populate: {
                    path: 'user', 
                    select: 'name avatar' 
                },
            });

        res.status(200).json({ data: comments });
    } catch (error) {
        console.error('Error fetching comments with replies:', error);
        res.status(500).json({ message: 'Failed to fetch comments with replies', error });
    }
};


exports.likeComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        let liked;
        if (comment.likedBy.includes(userId)) {
            comment.likedBy = comment.likedBy.filter(id => id.toString() !== userId);
            liked = false;
        } else {
            comment.likedBy.push(userId);
            liked = true;
        }

        await comment.save();

        res.status(200).json({
            message: liked ? 'Comment liked successfully' : 'Comment unliked successfully',
            data: {
                _id: comment._id,
                likedBy: comment.likedBy,
            },
            liked,
        });
    } catch (error) {
        console.error('Error toggling like on comment:', error);
        res.status(500).json({ message: 'Failed to toggle like on comment', error });
    }
};




exports.unlikeComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;

    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (!comment.likedBy.includes(userId)) {
            return res.status(400).json({ message: 'You have not liked this comment' });
        }

        comment.likedBy = comment.likedBy.filter((id) => id.toString() !== userId);
        await comment.save();

        res.status(200).json({ message: 'Comment unliked successfully', data: comment });
    } catch (error) {
        console.error('Error unliking comment:', error);
        res.status(500).json({ message: 'Failed to unlike comment', error });
    }
};
