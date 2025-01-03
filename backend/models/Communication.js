const mongoose = require('mongoose');

const communicationSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CommunicationMethod', // Reference to the CommunicationMethod model
        required: true, // Ensure that it's required
    },
    notes: {
        type: String,
        required: false
    },
    startDate: { type: Date }, // New field for communication date
    lastDate: { type: Date } // New field for last communication date
}); // Removed the extra comma here


const Communication = mongoose.model('Communication', communicationSchema);
module.exports = Communication;
