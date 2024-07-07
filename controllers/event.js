const Event = require('../models/event');
const Church = require('../models/church');
const Family = require('../models/family');

// Create event for a church
exports.createEvent = async (req, res, next) => {
    try {
        const { churchId, eventName, eventDate, description } = req.body;
        const church = await Church.findById(churchId);
        if (!church) {
            return res.status(404).json({ message: 'Church not found' });
        }
        const event = new Event({
            churchId,
            eventName,
            eventDate,
            description
        });
        await event.save();
        res.status(201).json({ message: 'Event created successfully', event });
    } catch (error) {
    }
};

// Register family for an event
exports.registerForEvent = async (req, res, next) => {
    try {
        const { eventId, familyId } = req.body;
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        const family = await Family.findById(familyId);
        if (!family) {
            return res.status(404).json({ message: 'Family not found' });
        }
        event.familiesRegistered.push(familyId);
        await event.save();
        res.status(200).json({ message: 'Family registered for event successfully', event });
    } catch (error) {
    }
};

// Get event details by event ID
exports.getEventDetails = async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findById(eventId)
            .populate('churchId')
            .populate('familiesRegistered')
            .exec();
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({ event });
    } catch (error) {
    }
};
