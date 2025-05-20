const ministryCategory = require("../models/ministryCategory");
const CustomEvent = require("../models/customEvent");
const User = require("../models/user");

const mongoose = require("mongoose");

exports.createMinistry = async (req, res) => {
  try {
    const ministry = new ministryCategory({
      name: req.body.name,
      description: req.body.description,
    });

    const savedMinistry = await ministry.save();
    res.status(201).json({ success: true, data: savedMinistry });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        error: "Failed to create ministry: " + error.message,
      });
  }
};

exports.getAllMinistryCategories = async (req, res) => {
  try {
    const categories = await ministryCategory.find();
    if (categories) {
      res.status(200).json({ success: true, categories });
    } else {
      res.status(404).json({ success: false, message: "No categories found" });
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch ministry categories" });
  }
};

exports.getMinistryId = async (req, res) => {
  try {
    const ministry = await ministryCategory.findById(req.params.ministryId);
    if (!ministry) {
      return res
        .status(404)
        .json({
          success: false,
          message: "The ministry with the given ID was not found.",
        });
    }
    res.status(200).json({ success: true, data: ministry });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        error: "Failed to retrieve ministry: " + error.message,
      });
  }
};

exports.deleteMinistry = async (req, res) => {
  try {
    const { ministryId } = req.params;

    const ministry = await ministryCategory.findByIdAndDelete(ministryId);
    if (!ministry) {
      return res
        .status(404)
        .json({ success: false, message: "Ministry not found!" });
    }
    res
      .status(200)
      .json({ success: true, message: "Ministry deleted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        error: "Failed to delete ministry: " + error.message,
      });
  }
};

exports.updateMinistryCategory = async (req, res) => {
  const { ministryId } = req.params;
  const { name, description } = req.body;
  try {
    const updatedCategory = await ministryCategory.findByIdAndUpdate(
      ministryId,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Ministry category not found." });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Error updating ministry category:", error);
    res.status(500).json({ message: "Error updating ministry category." });
  }
};

exports.getUsersByMinistryCategory = async (req, res) => {
  try {
    const { ministryCategoryId } = req.params;

    const MinistryCategory = await ministryCategory.findById(
      ministryCategoryId
    );
    if (!MinistryCategory) {
      return res.status(404).json({ message: "Ministry category not found" });
    }

    const users = await User.find({
      ministryCategory: ministryCategoryId,
    }).populate("ministryCategory");

    if (!users.length) {
      return res
        .status(404)
        .json({ message: "No users found for this ministry category" });
    }

    res.status(200).json({
      MinistryCategory: ministryCategory.name,
      users: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getMinistryEvents = async (req, res) => {
  try {
    const { ministryId } = req.params;

    if (!ministryId) {
      return res.status(400).json({ message: "Ministry ID is required." });
    }

    const events = await CustomEvent.find({ ministryCategory: ministryId });

    res.status(200).json(events);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to fetch ministry events",
        error: error.message,
      });
  }
};

// For announcements