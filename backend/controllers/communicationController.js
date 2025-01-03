const Communication = require('../models/Communication');

// Create a new communication
exports.createCommunication = async (req, res) => {
    try {
        // console.log(req.body);
        const communicationData = {
            ...req.body,
            startDate: req.body.startDate || new Date(), // Set to current date if not provided
            lastDate: req.body.lastDate || new Date() // Set to current date if not provided
        };
        const communication = new Communication(communicationData);
        await communication.save();
        // console.log(communication);
        res.status(201).send(communication);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Fetch all communications
exports.getCommunications = async (req, res) => {
    try {
        const communications = await Communication.find();
        res.status(200).send(communications);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update a communication by ID
exports.updateCommunication = async (req, res) => {
    const { id } = req.params;
    try {
        const communication = await Communication.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!communication) {
            return res.status(404).send();
        }
        res.status(200).send(communication);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a communication by ID
exports.deleteCommunication = async (req, res) => {
    const { id } = req.params;
    try {
        const communication = await Communication.findByIdAndDelete(id);
        if (!communication) {
            return res.status(404).send();
        }
        res.status(200).send(communication);
    } catch (error) {
        res.status(500).send(error);
    }
};
