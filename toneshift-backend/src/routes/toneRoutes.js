const express = require('express');
const router = express.Router();
const toneController = require('../controllers/toneController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Tone management routes
router.get('/', toneController.getAllTones);
router.post('/', toneController.createTone);
router.put('/:id', toneController.updateTone);
router.delete('/:id', toneController.deleteTone);

// Preferred tones routes
router.get('/preferred', toneController.getPreferredTones);
router.put('/preferred', toneController.updatePreferredTones);

module.exports = router;