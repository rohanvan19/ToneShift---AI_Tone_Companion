const Tone = require('../models/Tone');
const User = require('../models/User');
const { Op } = require('sequelize');

// Get all available tones (system + user custom tones)
const getAllTones = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get system tones and user's custom tones
    const tones = await Tone.findAll({
      where: {
        [Op.or]: [
          { isSystem: true },
          { creatorId: userId }
        ]
      },
      order: [
        ['isSystem', 'DESC'],
        ['name', 'ASC']
      ]
    });
    
    res.status(200).json({ tones });
  } catch (error) {
    console.error('Get tones error:', error);
    res.status(500).json({ message: 'Failed to get tones', error: error.message });
  }
};

// Create a new custom tone
const createTone = async (req, res) => {
  try {
    const { name, description, parameters } = req.body;
    const userId = req.user.id;
    
    // Validate name
    if (!name) {
      return res.status(400).json({ message: 'Tone name is required' });
    }
    
    // Check if a custom tone with this name already exists for this user
    const existingTone = await Tone.findOne({
      where: {
        name,
        creatorId: userId
      }
    });
    
    if (existingTone) {
      return res.status(400).json({ message: 'You already have a custom tone with this name' });
    }
    
    // Create the tone
    const tone = await Tone.create({
      name,
      description: description || '',
      isSystem: false,
      parameters: parameters || {},
      creatorId: userId
    });
    
    res.status(201).json({
      message: 'Custom tone created successfully',
      tone
    });
  } catch (error) {
    console.error('Create tone error:', error);
    res.status(500).json({ message: 'Failed to create custom tone', error: error.message });
  }
};

// Update a custom tone
const updateTone = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, parameters } = req.body;
    const userId = req.user.id;
    
    // Find the tone
    const tone = await Tone.findOne({
      where: {
        id,
        creatorId: userId
      }
    });
    
    if (!tone) {
      return res.status(404).json({ message: 'Custom tone not found' });
    }
    
    // Prevent updating system tones
    if (tone.isSystem) {
      return res.status(403).json({ message: 'System tones cannot be modified' });
    }
    
    // Update fields
    if (name) tone.name = name;
    if (description !== undefined) tone.description = description;
    if (parameters) tone.parameters = { ...tone.parameters, ...parameters };
    
    await tone.save();
    
    res.status(200).json({
      message: 'Custom tone updated successfully',
      tone
    });
  } catch (error) {
    console.error('Update tone error:', error);
    res.status(500).json({ message: 'Failed to update custom tone', error: error.message });
  }
};

// Delete a custom tone
const deleteTone = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Find the tone
    const tone = await Tone.findOne({
      where: {
        id,
        creatorId: userId
      }
    });
    
    if (!tone) {
      return res.status(404).json({ message: 'Custom tone not found' });
    }
    
    // Prevent deleting system tones
    if (tone.isSystem) {
      return res.status(403).json({ message: 'System tones cannot be deleted' });
    }
    
    await tone.destroy();
    
    res.status(200).json({ message: 'Custom tone deleted successfully' });
  } catch (error) {
    console.error('Delete tone error:', error);
    res.status(500).json({ message: 'Failed to delete custom tone', error: error.message });
  }
};

// Get user's preferred tones
const getPreferredTones = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const preferredTones = user.preferences?.defaultTones || [];
    
    res.status(200).json({ preferredTones });
  } catch (error) {
    console.error('Get preferred tones error:', error);
    res.status(500).json({ message: 'Failed to get preferred tones', error: error.message });
  }
};

// Update user's preferred tones
const updatePreferredTones = async (req, res) => {
  try {
    const { tones } = req.body;
    const userId = req.user.id;
    
    if (!Array.isArray(tones)) {
      return res.status(400).json({ message: 'Tones must be an array' });
    }
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update preferences
    user.preferences = {
      ...user.preferences,
      defaultTones: tones
    };
    
    await user.save();
    
    res.status(200).json({
      message: 'Preferred tones updated successfully',
      preferredTones: user.preferences.defaultTones
    });
  } catch (error) {
    console.error('Update preferred tones error:', error);
    res.status(500).json({ message: 'Failed to update preferred tones', error: error.message });
  }
};

module.exports = {
  getAllTones,
  createTone,
  updateTone,
  deleteTone,
  getPreferredTones,
  updatePreferredTones
};