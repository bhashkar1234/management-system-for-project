const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController'); // Import the new dashboard controller

// Route to get user dashboard data
router.get('/dashboard', dashboardController.getDashboardData); // Use the new controller

module.exports = router;
