const cloudinary = require('cloudinary')
const Post = require('../models/post')
const multer = require('multer');
const mongoose = require('mongoose');

// controllers/postController.js


exports.createPost = async (req, res) => {
    try {
        let images = [];

        if (req.files) {
            req.files.forEach(file => {
                images.push(file.path);
            });
        }

        if (req.file) {
            images.push(req.file.path);
        }

        if (req.body.images) {
            if (typeof req.body.images === 'string') {
                images.push(req.body.images);
            } else {
                images = images.concat(req.body.images);
            }
        }


        let imagesLinks = [];
        for (let imagePath of images) {
            try {
                const result = await cloudinary.uploader.upload(imagePath, {
                    folder: 'baghub/product',
                    width: 150,
                    crop: "scale",
                });
                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            } catch (error) {
                console.error("Cloudinary upload error:", error);
            }
        }

        // Set up the post object with images and other data
        const { name, description, categories } = req.body;
        const post = new Post({
            name,
            description,
            images: imagesLinks, // Store Cloudinary URLs in the images field

        });


        const savedPost = await post.save();
        res.status(201).json({ success: true, post: savedPost });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating post', error: error.message });
    }
}

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json({
            success: true,
            count: posts.length,
            posts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve posts',
            error: error.message,
        });
    }
};

// exports.deletePost = async (req, res) => {
//     const post = await Post.findByIdAndDelete(req.params.id);
//     if(!post) {
//         return res.status(404).json({
//             success: false,
//             message: 'Post not found'
//         })
//     }

//     res.status(200).json({
//         success: true,
//         message: 'Post Deleted'
//     })
// }

exports.deletePost = async (req, res) => {
    try {
        // Find the post by ID
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Delete each image from Cloudinary
        if (post.images && post.images.length > 0) {
            for (const image of post.images) {
                await cloudinary.uploader.destroy(image.public_id);
            }
        }

        // Delete the post from the database
        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Post and images deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const postId = req.params.id;

        // Find the post by ID
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Initialize an array to store new image links if any
        let imagesLinks = [];

        // If there are new images, upload them to Cloudinary
        if (req.files || req.file || req.body.images) {
            // Delete old images from Cloudinary if replacing them
            if (post.images && post.images.length > 0) {
                for (const image of post.images) {
                    await cloudinary.uploader.destroy(image.public_id);
                }
            }

            let newImages = [];

            // Collect all image paths from req.files, req.file, and req.body.images
            if (req.files) {
                req.files.forEach(file => {
                    newImages.push(file.path);
                });
            }

            if (req.file) {
                newImages.push(req.file.path);
            }

            if (req.body.images) {
                if (typeof req.body.images === 'string') {
                    newImages.push(req.body.images);
                } else {
                    newImages = newImages.concat(req.body.images);
                }
            }

            // Upload new images to Cloudinary and store their details
            for (let imagePath of newImages) {
                try {
                    const result = await cloudinary.uploader.upload(imagePath, {
                        folder: 'baghub/product',
                        width: 150,
                        crop: "scale",
                    });
                    imagesLinks.push({
                        public_id: result.public_id,
                        url: result.secure_url,
                    });
                } catch (error) {
                    console.error("Cloudinary upload error:", error);
                }
            }
        } else {
            // No new images provided; keep the old ones
            imagesLinks = post.images;
        }

        // Update the post fields
        post.name = req.body.name || post.name;
        post.description = req.body.description || post.description;
        post.categories = req.body.categories || post.categories;
        post.images = imagesLinks;  // Update with new images or keep existing

        // Save updated post to the database
        const updatedPost = await post.save();

        res.status(200).json({
            success: true,
            message: 'Post updated successfully',
            post: updatedPost
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

exports.getSinglePost = async (req, res) => {
    try {
        // Get the post ID from the request parameters
        const postId = req.params.id;

        // Find the post by its ID
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Return the post if found
        res.status(200).json({
            success: true,
            post
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

//guest
exports.getPosts = async (req, res, next) => {
    try {
        const resPerPage = 4; // Number of posts per page
        const page = Number(req.query.page) || 1; // Current page number
        const postsCount = await Post.countDocuments(); // Total count of posts

        // Find posts with pagination
        const posts = await Post.find()
            .skip(resPerPage * (page - 1)) // Skip posts for previous pages
            .limit(resPerPage); // Limit the results to posts per page

        res.status(200).json({
            success: true,
            count: posts.length,
            postsCount,
            posts,
            resPerPage,
            currentPage: page,
            totalPages: Math.ceil(postsCount / resPerPage) // Calculate total pages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve posts',
            error: error.message,
        });
    }
};
