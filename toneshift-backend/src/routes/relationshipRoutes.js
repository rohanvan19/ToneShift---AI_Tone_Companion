const express = require('express');
const router = express.Router();
const relationshipController = require('../controllers/relationshipController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// CRUD operations
router.post('/', relationshipController.createRelationship);
router.get('/', relationshipController.getAllRelationships);
router.get('/:id', relationshipController.getRelationship);
router.put('/:id', relationshipController.updateRelationship);
router.delete('/:id', relationshipController.deleteRelationship);

module.exports = router;