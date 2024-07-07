const bcrypt = require('bcrypt');
const Admin = require('../models/admin');
const Church = require('../models/church');
const jwt = require('jsonwebtoken');

// Register new admin
exports.registerAdmin = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new Admin({ username, password: hashedPassword });
        await admin.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Approve church registration
exports.approveChurch = async (req, res, next) => {
    try {
        const { churchId } = req.body;
        const church = await Church.findByIdAndUpdate(churchId, { approved: true }, { new: true });
        if (!church) {
            return res.status(404).json({ message: 'Church not found' });
        }
        res.status(200).json({ message: 'Church approved successfully', church });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin login
exports.loginAdmin = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            message: 'Admin logged in successfully',
            token,
            admin: {
                _id: admin._id,
                username: admin.username
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update church details
exports.updateChurch = async (req, res, next) => {
    try {
        const { churchId } = req.params;
        const updateData = req.body;
        const church = await Church.findByIdAndUpdate(churchId, updateData, { new: true });
        if (!church) {
            return res.status(404).json({ message: 'Church not found' });
        }
        res.status(200).json({ message: 'Church updated successfully', church });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete church
exports.deleteChurch = async (req, res, next) => {
    try {
        const { churchId } = req.params;
        const church = await Church.findByIdAndDelete(churchId);
        if (!church) {
            return res.status(404).json({ message: 'Church not found' });
        }
        res.status(200).json({ message: 'Church deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
