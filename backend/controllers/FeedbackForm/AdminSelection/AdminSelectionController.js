const AdminSelection = require("../../../models/FeedbackForm/AdminSelection/adminSelection");

exports.addSelection = async (req, res) => {
  try {
    const { category, typeId, date, time } = req.body; // Separate date and time

    const newSelection = new AdminSelection({
      category,
      typeId,
      date, // Store date separately
      time, // Store time separately
      isActive: true, // Automatically set to true
    });

    await newSelection.save();
    res.status(201).json({ message: "Selection added successfully", newSelection });
  } catch (error) {
    console.error("Error adding selection:", error);
    res.status(500).json({ error: "Failed to add selection" });
  }
};

exports.getSelections = async (req, res) => {
    try {
      const selections = await AdminSelection.find().populate({
        path: "typeId",
        select: "name",
        model: function(doc) {
          return doc.typeModel; // Dynamically select the correct model
        }
      });
  
      res.json(selections);
    } catch (error) {
      console.error("Error fetching selections:", error);
      res.status(500).json({ error: "Failed to fetch selections" });
    }
  };
  
  

exports.deactivateSelection = async (req, res) => {
    try {
      const { adminSelectionId } = req.params;
  
      const selection = await AdminSelection.findById(adminSelectionId);
      if (!selection) {
        return res.status(404).json({ error: "Selection not found" });
      }
  
      selection.isActive = false; 
      await selection.save();
  
      res.json({ message: "Selection deactivated successfully", selection });
    } catch (error) {
      console.error("Error deactivating selection:", error);
      res.status(500).json({ error: "Failed to deactivate selection" });
    }
  };