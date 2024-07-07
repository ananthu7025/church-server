// models/family.js

const mongoose = require('mongoose');

// Define member schema
const MemberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String },
    otp: { type: String } // Assuming OTP field for member
});

// Define family schema
const FamilySchema = new mongoose.Schema({
    churchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Church', required: true }, // Reference to Church model
    name: { type: String, required: true }, // Family name required
    members: [MemberSchema] // Array of members
}, { timestamps: true }); // Adding timestamps for createdAt and updatedAt fields

// Define Family model
const Family = mongoose.model('Family', FamilySchema);

module.exports = Family;
