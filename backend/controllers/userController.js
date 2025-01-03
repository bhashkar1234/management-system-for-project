// import Communication from '../models/Communication.js'; // Assuming a Communication model exists
// import Company from '../models/Company.js';

const Communication = require('../models/Communication.js');
const Company = require('../models/Company.js');

// Log a new communication
const logCommunication = async (req, res) => {
    const { companyId, type, date, notes } = req.body;
    try {
        const newCommunication = new Communication({ companyId, type, date, notes });
        await newCommunication.save();
        res.status(201).json(newCommunication);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all communications for a user
const getCommunications = async (req, res) => {
    try {
        const communications = await Communication.find().populate('companyId');
        res.status(200).json(communications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get notifications for overdue and due communications
const getNotifications = async (req, res) => {
    try {
        const notifications = await Communication.find({
            $or: [
                { dueDate: { $lt: new Date() } }, // Overdue
                { dueDate: { $eq: new Date() } }  // Due today
            ]
        }).populate('companyId');
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    logCommunication,
    getCommunications,
    getNotifications
};
