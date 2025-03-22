const Resource = require('../../models/Resources/resource');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');

exports.createResource = async (req, res) => {
    try {
        console.log("Incoming body:", req.body);
        console.log("Incoming files:", req.files);
        
        let imageLink = null;
        let imagesLinks = [];
        let videoLinks = [];
        let fileLink = null;

        if (req.files?.file) {
            const result = await cloudinary.uploader.upload(req.files.file[0].path, {
                folder: "eparokya/resources",
                resource_type: "raw",
            });
            fileLink = { public_id: result.public_id, url: result.secure_url };
        }

        if (req.files?.image) {
            const result = await cloudinary.uploader.upload(req.files.image[0].path, {
                folder: "eparokya/resources",
            });
            imageLink = { public_id: result.public_id, url: result.secure_url };
        }

        if (req.files?.images) {
            for (let file of req.files.images) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "eparokya/resources",
                });
                imagesLinks.push({ public_id: result.public_id, url: result.secure_url });
            }
        }

        if (req.files?.videos) {
            for (let file of req.files.videos) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "eparokya/resources",
                    resource_type: "video",
                });
                videoLinks.push({ public_id: result.public_id, url: result.secure_url });
            }
        }

        const { title, description, link, resourceCategory } = req.body;

        if (!title || !description || !link || !resourceCategory) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        if (!mongoose.Types.ObjectId.isValid(resourceCategory)) {
            return res.status(400).json({ success: false, message: "Invalid resource category ID" });
        }

        if (!fileLink && !imageLink && imagesLinks.length === 0) {
            return res.status(400).json({ success: false, message: "At least one of file, image, or images must be uploaded" });
        }

        const newResource = new Resource({
            title,
            description,
            link,
            file: fileLink,
            image: imagesLinks.length === 0 ? imageLink : null,
            images: imagesLinks.length > 0 ? imagesLinks : [],
            videos: videoLinks,
            resourceCategory: new mongoose.Types.ObjectId(resourceCategory),
        });

        const savedResource = await newResource.save();
        res.status(201).json({ success: true, resource: savedResource });

    } catch (error) {
        console.error("Error creating resource:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
  
exports.getAllResources = async (req, res) => {
    try {
        const resources = await Resource.find().populate('resourceCategory');
        res.status(200).json({ success: true, data: resources });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getResourceById = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.resourceId).populate('resourceCategory');
        if (!resource) return res.status(404).json({ success: false, message: "Resource not found" });
        res.status(200).json({ success: true, data: resource });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateResource = async (req, res) => {
    try {
      let updateData = req.body;
  
      if (req.files) {
        if (req.files.images) {
          let imagesLinks = [];
          for (let file of req.files.images) {
            const result = await cloudinary.uploader.upload(file.path, { folder: "eparokya/resources" });
            imagesLinks.push({ public_id: result.public_id, url: result.secure_url });
          }
          updateData.images = imagesLinks;
          updateData.image = imagesLinks.length > 0 ? imagesLinks[0] : null;
        }
  
        if (req.files.video) {
          const result = await cloudinary.uploader.upload(req.files.video.path, {
            folder: "eparokya/resources",
            resource_type: "video",
          });
          updateData.videos = [result.secure_url];
        }
  
        if (req.files.file) {
          const result = await cloudinary.uploader.upload(req.files.file.path, {
            folder: "eparokya/resources",
            resource_type: "raw",
          });
          updateData.file = result.secure_url;
        }
      }
  
      const updatedResource = await Resource.findByIdAndUpdate(req.params.resourceId, updateData, { new: true });
      if (!updatedResource) return res.status(404).json({ success: false, message: "Resource not found" });
      res.status(200).json({ success: true, data: updatedResource });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
};
  
exports.deleteResource = async (req, res) => {
  
    try {
      const resource = await Resource.findById(req.params.resourceById);
      if (!resource) return res.status(404).json({ success: false, message: "Resource not found" });
  
      if (resource.image) await cloudinary.uploader.destroy(resource.image.public_id);
      if (resource.images.length > 0) {
        for (let img of resource.images) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
      if (resource.videos.length > 0) {
        for (let video of resource.videos) {
          // NOTE: If you only stored the URL for videos, Cloudinary's destroy may not work.
          // It is recommended to store the video public_id if you plan to delete videos.
          await cloudinary.uploader.destroy(video);
        }
      }
      if (resource.file) await cloudinary.uploader.destroy(resource.file);
  
      await resource.deleteOne();
      res.status(200).json({ success: true, message: "Resource deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
};

exports.toggleBookmark = async (req, res) => {
  try {
      const { userId } = req.body;
      const { resourceId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(resourceId)) {
          return res.status(400).json({ success: false, message: "Invalid user or resource ID" });
      }

      const resource = await Resource.findById(resourceId);
      if (!resource) {
          return res.status(404).json({ success: false, message: "Resource not found" });
      }

      const bookmarkIndex = resource.bookmarks.findIndex(bookmark => bookmark.userId.toString() === userId);

      let message;
      if (bookmarkIndex !== -1) {
          resource.bookmarks.splice(bookmarkIndex, 1);
          message = "Bookmark removed";
      } else {
          resource.bookmarks.push({ userId });
          message = "Bookmark added";
      }

      await resource.save();

      return res.status(200).json({
          success: true,
          message,
          resource: {
              _id: resource._id,
              bookmarks: resource.bookmarks,
          },
      });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserBookmarks = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }
        const resources = await Resource.find({ "bookmarks.userId": userId });

        if (!resources || resources.length === 0) {
            return res.status(404).json({ success: false, message: "No bookmarks found for this user" });
        }
        res.status(200).json({
            success: true,
            bookmarks: resources.map(resource => ({
                _id: resource._id,
                title: resource.title,
                description: resource.description,
                link: resource.link,
                images: resource.images,
                resourceCategory: resource.resourceCategory,
            })),
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


  



