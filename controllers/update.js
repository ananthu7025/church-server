const Update = require('../models/update');
const Church = require('../models/church');
const Event = require('../models/event');

// Create an update for a church
exports.createChurchUpdate = async (req, res, next) => {
    try {
        const { churchId, title, content } = req.body;
        const church = await Church.findById(churchId);
        if (!church) {
            return res.status(404).json({ message: 'Church not found' });
        }
        const update = new Update({
            churchId,
            title,
            content
        });
        await update.save();
        res.status(201).json({ message: 'Church update created successfully', update });
    } catch (error) {
    }
};

// Get updates for a church
exports.getChurchUpdates = async (req, res, next) => {
    try {
        const { churchId } = req.params;
        const updates = await Update.find({ churchId });
        res.status(200).json({ updates });
    } catch (error) {
    }
};


