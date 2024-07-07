const bcrypt = require('bcrypt');
const Church = require('../models/church');
const Family = require('../models/family');

// Register new church
exports.registerChurch = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const church = new Church({ name, email, password: hashedPassword, approved: false }); // Set approved to false initially
        await church.save();
        res.status(201).json({ message: 'Church registration submitted successfully. Waiting for admin approval.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Church Login
exports.loginChurch = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const church = await Church.findOne({ email });
        if (!church) {
            return res.status(404).json({ message: 'Church not found' });
        }
        if (!church.approved) {
            return res.status(403).json({ message: 'Church not approved yet' });
        }
        const isPasswordValid = await bcrypt.compare(password, church.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ churchId: church._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            message: 'Church logged in successfully',
            token,
            church: {
                _id: church._id,
                name: church.name,
                email: church.email,
                approved: church.approved
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Add family under church
exports.addFamily = async (req, res, next) => {
    try {
        const { churchId, familyName, members } = req.body;
        const church = await Church.findById(churchId);
        if (!church) {
            return res.status(404).json({ message: 'Church not found' });
        }
        if (!church.approved) {
            return res.status(403).json({ message: 'Church not approved yet' });
        }
        const family = new Family({ churchId, name: familyName, members });
        await family.save();
        church.families.push(family._id);
        await church.save();
        res.status(201).json({ message: 'Family added successfully', family });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
// Bulk add families
exports.bulkAddFamilies = async (req, res, next) => {
    try {
        const { churchId, families } = req.body;
        const church = await Church.findById(churchId);
        if (!church) {
            return res.status(404).json({ message: 'Church not found' });
        }
        if (!church.approved) {
            return res.status(403).json({ message: 'Church not approved yet' });
        }

        const addedFamilies = [];

        for (const familyData of families) {
            console.log(familyData)
            const family = new Family({ churchId, name: familyData.name, members: familyData.members });
            await family.save();
            church.families.push(family._id);
            addedFamilies.push(family);
        }

        await church.save();

        res.status(201).json({ message: 'Families added successfully', families: addedFamilies });
    } catch (error) {
        console.error('Error adding families:', error); // Log the error
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// Get all families under a specific church
exports.getAllFamilies = async (req, res, next) => {
    try {
        const { churchId } = req.params;
        const church = await Church.findById(churchId);
        
        if (!church) {
            return res.status(404).json({ message: 'Church not found' });
        }
        
        const families = await Family.find({ churchId: churchId });

        // Format members to match the updated MemberSchema
        const formattedFamilies = families.map(family => ({
            _id: family._id,
            churchId: family.churchId,
            name: family.name,
            members: family.members.map(member => ({
                name: member.name,
                phone: member.phone,
                bloodGroup: member.bloodGroup,
                working: member.working,
                company: member.company,
                dob: member.dob,
                aadharNumber: member.aadharNumber
            }))
        }));

        res.status(200).json({ families: formattedFamilies });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};