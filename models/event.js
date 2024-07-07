// models/event.js

const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    churchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Church', required: true },
    eventName: { type: String, required: true },
    eventDate: { type: Date, required: true },
    description: { type: String },
    familiesRegistered: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Family' }]
});

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;
