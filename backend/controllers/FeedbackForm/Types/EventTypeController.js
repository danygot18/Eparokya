const EventType = require("../../../models/FeedbackForm/Types/EventType");

exports.createEventType = async (req, res) => {
  try {
    const { name } = req.body;
    const existingEventType = await EventType.findOne({ name });
    if (existingEventType) {
      return res.status(400).json({ error: "EventType already exists" });
    }

    const eventType = new EventType({ name });
    await eventType.save();

    res.status(201).json({ message: "EventType created successfully", eventType });
  } catch (error) {
    console.error("Error creating EventType:", error);
    res.status(500).json({ error: "Failed to create EventType" });
  }
};
exports.getAllEventTypes = async (req, res) => {
  try {
    const eventTypes = await EventType.find();
    res.json(eventTypes);
  } catch (error) {
    console.error("Error fetching EventTypes:", error);
    res.status(500).json({ error: "Failed to fetch EventTypes" });
  }
};
exports.getEventTypeById = async (req, res) => {
  try {
    const eventType = await EventType.findById(req.params.id);
    if (!eventType) {
      return res.status(404).json({ error: "EventType not found" });
    }
    res.json(eventType);
  } catch (error) {
    console.error("Error fetching EventType:", error);
    res.status(500).json({ error: "Failed to fetch EventType" });
  }
};

exports.deleteEventType = async (req, res) => {

  try {
    const { eventToDelete } = req.params;

    const eventType = await EventType.findByIdAndDelete(eventToDelete);
    if (!eventType) {
      return res.status(404).json({ error: "EventType not found" });
    }
    res.json({ message: "EventType deleted successfully" });
  } catch (error) {
    console.error("Error deleting EventType:", error);
    res.status(500).json({ error: "Failed to delete EventType" });
  }
};

