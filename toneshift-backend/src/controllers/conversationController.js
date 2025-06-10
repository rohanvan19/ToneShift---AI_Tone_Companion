const Conversation = require('../models/Conversation');
const User = require('../models/User');
const Relationship = require('../models/Relationship');
const { generateResponse, generateMultipleTones } = require('../utils/ollamaService');

// Create a new conversation
const createConversation = async (req, res) => {
  try {
    const { title, context, relationshipId } = req.body;
    const userId = req.user.id;

    const conversation = await Conversation.create({
      title,
      context: context || '',
      UserId: userId,
      relationship: relationshipId
    });

    res.status(201).json({
      message: 'Conversation created successfully',
      conversation
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ message: 'Failed to create conversation', error: error.message });
  }
};

// Get all conversations for a user
const getAllConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.findAll({
      where: { UserId: userId },
      order: [['updatedAt', 'DESC']]
    });

    res.status(200).json({ conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Failed to get conversations', error: error.message });
  }
};

// Get a specific conversation
const getConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findOne({
      where: { id, UserId: userId }
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.status(200).json({ conversation });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ message: 'Failed to get conversation', error: error.message });
  }
};

// Update a conversation
const updateConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, context, messages, relationshipId } = req.body;
    const userId = req.user.id;

    const conversation = await Conversation.findOne({
      where: { id, UserId: userId }
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Update fields
    if (title) conversation.title = title;
    if (context !== undefined) conversation.context = context;
    if (messages) conversation.messages = messages;
    if (relationshipId !== undefined) conversation.relationship = relationshipId;

    await conversation.save();

    res.status(200).json({
      message: 'Conversation updated successfully',
      conversation
    });
  } catch (error) {
    console.error('Update conversation error:', error);
    res.status(500).json({ message: 'Failed to update conversation', error: error.message });
  }
};

// Delete a conversation
const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findOne({
      where: { id, UserId: userId }
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    await conversation.destroy();

    res.status(200).json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({ message: 'Failed to delete conversation', error: error.message });
  }
};

// Add a message to a conversation
const addMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, sender } = req.body;
    const userId = req.user.id;

    const conversation = await Conversation.findOne({
      where: { id, UserId: userId }
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Create a new message
    const newMessage = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date().toISOString()
    };

    // Add to messages array
    const messages = conversation.messages || [];
    conversation.messages = [...messages, newMessage];

    await conversation.save();

    res.status(200).json({
      message: 'Message added successfully',
      newMessage
    });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({ message: 'Failed to add message', error: error.message });
  }
};

module.exports = {
  createConversation,
  getAllConversations,
  getConversation,
  updateConversation,
  deleteConversation,
  addMessage
};