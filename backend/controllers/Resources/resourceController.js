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

        // Handle file upload
        if (req.files?.file) {
            const result = await cloudinary.uploader.upload(req.files.file[0].path, {
                folder: "eparokya/resources",
                resource_type: "raw",
            });
            fileLink = { public_id: result.public_id, url: result.secure_url };
        }

        // Handle single image upload
        if (req.files?.image) {
            const result = await cloudinary.uploader.upload(req.files.image[0].path, {
                folder: "eparokya/resources",
            });
            imageLink = { public_id: result.public_id, url: result.secure_url };
        }

        // Handle multiple images upload
        if (req.files?.images) {
            for (let file of req.files.images) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "eparokya/resources",
                });
                imagesLinks.push({ public_id: result.public_id, url: result.secure_url });
            }
        }

        // Handle video uploads (array)
        if (req.files?.videos) {
            for (let file of req.files.videos) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "eparokya/resources",
                    resource_type: "video",
                });
                videoLinks.push({ public_id: result.public_id, url: result.secure_url });
            }
        }

        // Destructure required fields
        const { title, description, link, resourceCategory } = req.body;

        // Validate required fields
        if (!title || !description || !link || !resourceCategory) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Validate resourceCategory as a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(resourceCategory)) {
            return res.status(400).json({ success: false, message: "Invalid resource category ID" });
        }

        // Ensure at least one file/image is provided
        if (!fileLink && !imageLink && imagesLinks.length === 0) {
            return res.status(400).json({ success: false, message: "At least one of file, image, or images must be uploaded" });
        }

        // Create new resource document
        const newResource = new Resource({
            title,
            description,
            link,
            file: fileLink,
            image: imagesLinks.length === 0 ? imageLink : null, // Store single image only if multiple aren't uploaded
            images: imagesLinks.length > 0 ? imagesLinks : [],
            videos: videoLinks,
            resourceCategory: new mongoose.Types.ObjectId(resourceCategory), // Ensure it's stored as ObjectId
        });

        // Save the new resource
        const savedResource = await newResource.save();
        res.status(201).json({ success: true, resource: savedResource });

    } catch (error) {
        console.error("Error creating resource:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

  
  

// Get all resources
exports.getAllResources = async (req, res) => {
    try {
        const resources = await Resource.find().populate('resourceCategory');
        res.status(200).json({ success: true, data: resources });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single resource by ID
exports.getResourceById = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.resourceId).populate('resourceCategory');
        if (!resource) return res.status(404).json({ success: false, message: "Resource not found" });
        res.status(200).json({ success: true, data: resource });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a resource
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
  
// Delete a resource
exports.deleteResource = async (req, res) => {
  
    try {
      const resource = await Resource.findById(req.params.resourceById);
      if (!resource) return res.status(404).json({ success: false, message: "Resource not found" });
  
      // Remove media from Cloudinary
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
  



