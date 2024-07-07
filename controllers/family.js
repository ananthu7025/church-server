const Family = require('../models/family');
const jwt = require('jsonwebtoken');

const generateStaticOTP = async () => {
    return '1234'; // Static OTP for demo purposes; replace with actual OTP generation logic
};

// Generate OTP and save in Family schema
exports.generateOTP = async (req, res, next) => {
    try {
        const { phoneNumber } = req.body;
        const family = await Family.findOne({ 'members.phoneNumber': phoneNumber });
        if (!family) {
            return res.status(404).json({ message: 'Family member not found' });
        }
        const otp = await generateStaticOTP();
        family.members.forEach(member => {
            if (member.phoneNumber === phoneNumber) {
                member.otp = otp;
            }
        });
        await family.save();
        res.status(200).json({ message: 'OTP generated and saved successfully', otp });
    } catch (error) {
    }
};

// Verify OTP and login family member
exports.verifyOTP = async (req, res, next) => {
    try {
        const { phoneNumber, otp } = req.body;
        const family = await Family.findOne({ 'members.phoneNumber': phoneNumber });
        if (!family) {
            return res.status(404).json({ message: 'Family member not found' });
        }
        const member = family.members.find(member => member.phoneNumber === phoneNumber);
        if (!member || member.otp !== otp) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }
        member.otp = undefined;
        await family.save();
        const token = jwt.sign({ familyId: family._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            message: 'OTP verified successfully. Family member logged in.',
            token,
            family: {
                _id: family._id
            }
        });
    } catch (error) {
    }
};

// Get family details for a family member
exports.getMyFamilyDetails = async (req, res, next) => {
    try {
        const { phoneNumber } = req.query;
        const family = await Family.findOne({ 'members.phoneNumber': phoneNumber })
            .populate('churchId')
            .exec();
        if (!family) {
            return res.status(404).json({ message: 'Family member not found' });
        }
        res.status(200).json({ family });
    } catch (error) {
    }
};
