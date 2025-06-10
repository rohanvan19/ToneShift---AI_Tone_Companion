const express = require('express');
const router = express.Router();
const responseController = require('../controllers/responseController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Response generation endpoints
router.post('/generate', responseController.generateToneResponse);
router.post('/generate-multiple', responseController.generateMultipleResponses);
router.post('/generate-and-save', responseController.generateAndSaveResponse);

module.exports = router;