const express = require('express');
const { getCommunicationMethods, createCommunicationMethod, updateCommunicationMethod, deleteCommunicationMethod } = require('../controllers/communicationMethodController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getCommunicationMethods);
router.post('/', auth, createCommunicationMethod);
router.put('/:id', auth, updateCommunicationMethod);
router.delete('/:id', auth, deleteCommunicationMethod);

module.exports = router;
