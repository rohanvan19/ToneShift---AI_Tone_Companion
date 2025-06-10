const { generateResponse, generateMultipleTones } = require('../utils/ollamaService');
const Conversation = require('../models/Conversation');
const Relationship = require('../models/Relationship');
const User = require('../models/User');

// Generate a response with a specific tone
const generateToneResponse = async (req, res) => {
  try {
    const { message, tone, conversationId } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!message || !tone) {
      return res.status(400).json({ message: 'Message and tone are required' });
    }

    let context = '';
    
    // If conversation ID is provided, get conversation context
    if (conversationId) {
      const conversation = await Conversation.findOne({
        where: { id: conversationId, UserId: userId }
      });
      
      if (conversation) {
        context = conversation.context || '';
        
        // If conversation has a relationship, get that context too
        if (conversation.relationship) {
          const relationship = await Relationship.findOne({
            where: { id: conversation.relationship, UserId: userId }
          });
          
          if (relationship && relationship.context) {
            context += '\n' + relationship.context;
          }
        }
      }
    }

    // Generate response
    const response = await generateResponse(message, tone, context);

    res.status(200).json({
      tone,
      response
    });
  } catch (error) {
    console.error('Generate response error:', error);
    res.status(500).json({ message: 'Failed to generate response', error: error.message });
  }
};

// Generate responses in multiple tones
const generateMultipleResponses = async (req, res) => {
  try {
    const { message, tones, conversationId } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!message || !tones || !Array.isArray(tones) || tones.length === 0) {
      return res.status(400).json({ 
        message: 'Message and at least one tone are required' 
      });
    }

    let context = '';
    let relationshipInfo = null;
    
    // If conversation ID is provided, get conversation context
    if (conversationId) {
      const conversation = await Conversation.findOne({
        where: { id: conversationId, UserId: userId }
      });
      
      if (conversation) {
        context = conversation.context || '';
        
        // If conversation has a relationship, get that context too
        if (conversation.relationship) {
          const relationship = await Relationship.findOne({
            where: { id: conversation.relationship, UserId: userId }
          });
          
          if (relationship) {
            relationshipInfo = relationship;
            if (relationship.context) {
              context += '\n' + relationship.context;
            }
          }
        }
      }
    }

    // If no tones specified, try to get from relationship preferred tones or user preferences
    let tonesToUse = tones;
    if (tones.length === 0) {
      if (relationshipInfo && relationshipInfo.preferredTones && relationshipInfo.preferredTones.length > 0) {
        tonesToUse = relationshipInfo.preferredTones;
      } else {
        const user = await User.findByPk(userId);
        if (user && user.preferences && user.preferences.defaultTones) {
          tonesToUse = user.preferences.defaultTones;
        } else {
          tonesToUse = ['professional', 'casual', 'friendly']; // Default fallback
        }
      }
    }

    // Generate responses
    const responses = await generateMultipleTones(message, tonesToUse, context);

    res.status(200).json({
      responses
    });
  } catch (error) {
    console.error('Generate multiple responses error:', error);
    res.status(500).json({ message: 'Failed to generate responses', error: error.message });
  }
};

// Generate a response and save it to a conversation
const generateAndSaveResponse = async (req, res) => {
  try {
    const { message, tone, conversationId } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!message || !tone || !conversationId) {
      return res.status(400).json({ 
        message: 'Message, tone, and conversation ID are required' 
      });
    }

    // Find conversation
    const conversation = await Conversation.findOne({
      where: { id: conversationId, UserId: userId }
    });
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Build context
    let context = conversation.context || '';
    
    // If conversation has a relationship, get that context too
    if (conversation.relationship) {
      const relationship = await Relationship.findOne({
        where: { id: conversation.relationship, UserId: userId }
      });
      
      if (relationship && relationship.context) {
        context += '\n' + relationship.context;
      }
    }

    // Add the last few messages as context if they exist
    if (conversation.messages && conversation.messages.length > 0) {
      const recentMessages = conversation.messages.slice(-3); // Last 3 messages
      context += '\n\nRecent conversation:\n';
      recentMessages.forEach(msg => {
        context += `${msg.sender}: ${msg.content}\n`;
      });
    }

    // Generate response
    const aiResponse = await generateResponse(message, tone, context);

    // Create user message
    const userMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    // Create AI message
    const aiMessage = {
      id: (Date.now() + 1).toString(),
      content: aiResponse,
      sender: 'ai',
      tone,
      timestamp: new Date().toISOString()
    };

    // Add to messages array
    const messages = conversation.messages || [];
    conversation.messages = [...messages, userMessage, aiMessage];

    await conversation.save();

    res.status(200).json({
      message: 'Response generated and saved successfully',
      userMessage,
      aiMessage
    });
  } catch (error) {
    console.error('Generate and save response error:', error);
    res.status(500).json({ message: 'Failed to generate and save response', error: error.message });
  }
};

module.exports = {
  generateToneResponse,
  generateMultipleResponses,
  generateAndSaveResponse
};