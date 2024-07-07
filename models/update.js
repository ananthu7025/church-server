// models/update.js

const mongoose = require('mongoose');

const UpdateSchema = new mongoose.Schema({
    churchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Church', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    datePosted: { type: Date, default: Date.now }
});

const Update = mongoose.model('Update', UpdateSchema);

module.exports = Update;
