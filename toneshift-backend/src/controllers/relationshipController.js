const Relationship = require('../models/Relationship');

// Create a new relationship profile
const createRelationship = async (req, res) => {
  try {
    const { name, category, context, preferredTones, additionalInfo } = req.body;
    const userId = req.user.id;

    const relationship = await Relationship.create({
      name,
      category: category || 'personal',
      context: context || '',
      preferredTones: preferredTones || ['friendly', 'respectful'],
      additionalInfo: additionalInfo || {},
      UserId: userId
    });

    res.status(201).json({
      message: 'Relationship profile created successfully',
      relationship
    });
  } catch (error) {
    console.error('Create relationship error:', error);
    res.status(500).json({ message: 'Failed to create relationship profile', error: error.message });
  }
};

// Get all relationship profiles for a user
const getAllRelationships = async (req, res) => {
  try {
    const userId = req.user.id;

    const relationships = await Relationship.findAll({
      where: { UserId: userId },
      order: [['name', 'ASC']]
    });

    res.status(200).json({ relationships });
  } catch (error) {
    console.error('Get relationships error:', error);
    res.status(500).json({ message: 'Failed to get relationship profiles', error: error.message });
  }
};

// Get a specific relationship profile
const getRelationship = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const relationship = await Relationship.findOne({
      where: { id, UserId: userId }
    });

    if (!relationship) {
      return res.status(404).json({ message: 'Relationship profile not found' });
    }

    res.status(200).json({ relationship });
  } catch (error) {
    console.error('Get relationship error:', error);
    res.status(500).json({ message: 'Failed to get relationship profile', error: error.message });
  }
};

// Update a relationship profile
const updateRelationship = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, context, preferredTones, additionalInfo } = req.body;
    const userId = req.user.id;

    const relationship = await Relationship.findOne({
      where: { id, UserId: userId }
    });

    if (!relationship) {
      return res.status(404).json({ message: 'Relationship profile not found' });
    }

    // Update fields
    if (name) relationship.name = name;
    if (category) relationship.category = category;
    if (context !== undefined) relationship.context = context;
    if (preferredTones) relationship.preferredTones = preferredTones;
    if (additionalInfo) relationship.additionalInfo = { ...relationship.additionalInfo, ...additionalInfo };

    await relationship.save();

    res.status(200).json({
      message: 'Relationship profile updated successfully',
      relationship
    });
  } catch (error) {
    console.error('Update relationship error:', error);
    res.status(500).json({ message: 'Failed to update relationship profile', error: error.message });
  }
};

// Delete a relationship profile
const deleteRelationship = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const relationship = await Relationship.findOne({
      where: { id, UserId: userId }
    });

    if (!relationship) {
      return res.status(404).json({ message: 'Relationship profile not found' });
    }

    await relationship.destroy();

    res.status(200).json({ message: 'Relationship profile deleted successfully' });
  } catch (error) {
    console.error('Delete relationship error:', error);
    res.status(500).json({ message: 'Failed to delete relationship profile', error: error.message });
  }
};

module.exports = {
  createRelationship,
  getAllRelationships,
  getRelationship,
  updateRelationship,
  deleteRelationship
};