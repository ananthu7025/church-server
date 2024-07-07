const mongoose = require('mongoose');

const ChurchSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    approved: { type: Boolean, default: false }, // Approval status
    families: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Family' }]
});

const Church = mongoose.model('Church', ChurchSchema);

module.exports = Church;
