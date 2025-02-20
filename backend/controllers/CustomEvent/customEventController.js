const CustomEvent = require('../../models/customEvent');

exports.getAllCustomEvents = async (req, res) => {
  try {
    const customEvents = await CustomEvent.find();
    res.status(200).json(customEvents);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch custom events", error: error.message });
  }
};

exports.addCustomEvent = async (req, res) => {
  try {
    const { title, customeventDate, customeventTime, ministryCategory, description } = req.body;

    if (!title || !customeventDate) {
      return res.status(400).json({ message: "Title and event date are required." });
    }

    const newEvent = await CustomEvent.create({
      title,
      description,
      customeventDate,
      customeventTime, 
      ministryCategory,
    });

    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: "Failed to add custom event", error: error.message });
  }
};


exports.deleteCustomEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const deletedEvent = await CustomEvent.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete event", error: error.message });
  }
};

exports.getCustomEventById = async (req, res) => {
try {
  const event = await CustomEvent.findById(req.params.customEventId);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }
  res.json(event);
} catch (error) {
  console.error('Error fetching custom event:', error);
  res.status(500).json({ message: 'Failed to fetch event details' });
}
};
