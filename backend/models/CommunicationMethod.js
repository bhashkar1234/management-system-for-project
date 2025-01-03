const mongoose = require('mongoose');

const communicationMethodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    sequence: {
        type: Number,
        required: true,
    },
    mandatory: {
        type: Boolean,
        required: true,
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    },
    
});

const CommunicationMethod = mongoose.model('CommunicationMethod', communicationMethodSchema);

module.exports = CommunicationMethod;