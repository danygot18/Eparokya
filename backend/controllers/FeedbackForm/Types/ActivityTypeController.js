const ActivityType  = require("../../../models/FeedbackForm/Types/ActivityType");

// Create ActivityType
exports.createActivityType = async (req, res) => {
    try {
      const { name } = req.body;
  
      const existingActivityType = await ActivityType.findOne({ name });
      if (existingActivityType) {
        return res.status(400).json({ error: "ActivityType already exists" });
      }
  
      const activityType = new ActivityType({ name });
      await activityType.save();
  
      res.status(201).json({ message: "ActivityType created successfully", activityType });
    } catch (error) {
      console.error("Error creating ActivityType:", error);
      res.status(500).json({ error: "Failed to create ActivityType" });
    }
  };
  
  exports.getAllActivityTypes = async (req, res) => {
    try {
      const activityTypes = await ActivityType.find();
      res.json(activityTypes);
    } catch (error) {
      console.error("Error fetching ActivityTypes:", error);
      res.status(500).json({ error: "Failed to fetch ActivityTypes" });
    }
  };
  
  exports.getActivityTypeById = async (req, res) => {
    try {
      const activityType = await ActivityType.findById(req.params.id);
      if (!activityType) {
        return res.status(404).json({ error: "ActivityType not found" });
      }
      res.json(activityType);
    } catch (error) {
      console.error("Error fetching ActivityType:", error);
      res.status(500).json({ error: "Failed to fetch ActivityType" });
    }
  };
  

  // Delete ActivityType
  exports.deleteActivityType = async (req, res) => {
    try {
      const activityType = await ActivityType.findByIdAndDelete(req.params.id);
      if (!activityType) {
        return res.status(404).json({ error: "ActivityType not found" });
      }
      res.json({ message: "ActivityType deleted successfully" });
    } catch (error) {
      console.error("Error deleting ActivityType:", error);
      res.status(500).json({ error: "Failed to delete ActivityType" });
    }
  };
  