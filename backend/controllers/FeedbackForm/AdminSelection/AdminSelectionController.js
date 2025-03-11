const AdminSelection = require("../../../models/FeedbackForm/AdminSelection/adminSelection");

const modelMap = {
  EventType: require("../../../models/FeedbackForm/Types/EventType"),
  ActivityType: require("../../../models/FeedbackForm/Types/ActivityType"),
  Priest: require("../../../models/Priest/priest"),
};

// ✅ Add Selection
exports.addSelection = async (req, res) => {
  try {
    const { category, typeModel, typeId, date, time } = req.body;

    if (!typeModel) {
      return res.status(400).json({ error: "typeModel is required" });
    }

    const newSelection = new AdminSelection({
      category,
      typeModel,
      typeId,
      date,
      time,
      isActive: true,
    });

    await newSelection.save();
    res.status(201).json({ message: "Selection added successfully", newSelection });
  } catch (error) {
    console.error("Error adding selection:", error);
    res.status(500).json({ error: "Failed to add selection" });
  }
};

// ✅ Get All Selections
exports.getSelections = async (req, res) => {
  try {
    const selections = await AdminSelection.find();

    // Manually populate the referenced models
    const populatedSelections = await Promise.all(
      selections.map(async (selection) => {
        const Model = modelMap[selection.category]; // ✅ Corrected from activeSelection.category
        if (!Model) return selection; // Skip if model is missing

        const populatedType = await Model.findById(selection.typeId).select("name");
        return { ...selection.toObject(), typeId: populatedType };
      })
    );

    res.json(populatedSelections);
  } catch (error) {
    console.error("Error fetching selections:", error);
    res.status(500).json({ error: "Failed to fetch selections" });
  }
};

// ✅ Get Active Selection
exports.getActiveSelection = async (req, res) => {
  try {
    const activeSelection = await AdminSelection.findOne({ isActive: true });

    if (!activeSelection) {
      return res.status(404).json({ error: "No active selection found" });
    }

    console.log("Active selection category:", activeSelection.category);
    console.log("Available modelMap keys:", Object.keys(modelMap));

    const categoryKey = activeSelection.category.charAt(0).toUpperCase() + activeSelection.category.slice(1) + "Type";
    console.log("Resolved categoryKey:", categoryKey);

    const Model = modelMap[categoryKey];
    
    if (!Model) {
      console.error("Invalid category:", categoryKey);
      return res.status(500).json({ error: "Invalid typeModel" });
    }

    console.log("Fetching TypeId:", activeSelection.typeId);
    const populatedType = await Model.findById(activeSelection.typeId).select("name");

    if (!populatedType) {
      console.error("Invalid typeId:", activeSelection.typeId);
      return res.status(500).json({ error: "Type ID not found" });
    }

    res.json({ ...activeSelection.toObject(), typeId: populatedType });
  } catch (error) {
    console.error("Error fetching active selection:", error);
    res.status(500).json({ error: "Failed to fetch active selection" });
  }
};





// ✅ Deactivate Selection
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
