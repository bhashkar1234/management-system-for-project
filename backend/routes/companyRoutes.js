const express = require('express');
const { 
  addCompany, 
  getCompanies, 
  updateCompany, 
  updateCommunicationMethods,
  deleteCompany 
} = require('../controllers/companyController.js');
const auth = require('../middleware/auth');

const router = express.Router();

// Company routes
router.post('/', auth, addCompany);
router.get('/', auth, getCompanies);
router.put('/:id', auth, updateCompany);
router.put('/:id/communication-methods', auth, updateCommunicationMethods);
router.delete('/:id', auth, deleteCompany);

module.exports = router;
