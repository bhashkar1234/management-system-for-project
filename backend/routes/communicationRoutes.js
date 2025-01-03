const express = require('express');
const auth = require('../middleware/auth');
const communicationController = require('../controllers/communicationController');

const router = express.Router();

// Route to fetch communications
router.get('/', auth, communicationController.getCommunications);

// Create a new communication
router.post('/', auth, communicationController.createCommunication);

// Update a communication by ID
router.put('/:id', auth, communicationController.updateCommunication);

// Delete a communication by ID
router.delete('/:id', auth, communicationController.deleteCommunication);

module.exports = router;
