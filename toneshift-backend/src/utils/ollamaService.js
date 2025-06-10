// filepath: c:\Users\vanma\StudioProjects\ToneShift\toneshift-backend\src\utils\ollamaService.js
const axios = require('axios');
const Tone = require('../models/Tone');
const { Op } = require('sequelize');
require('dotenv').config();

const OLLAMA_API_URL = process.env.OLLAMA_API_URL;
const DEFAULT_MODEL = process.env.OLLAMA_MODEL;

/**
 * Generate a response with a specific tone
 * @param {string} message - The user's message
 * @param {string} tone - The desired tone (funny, professional, casual, etc.)
 * @param {string} context - Additional context about the conversation
 * @returns {Promise<string>} - The generated response
 */
async function generateResponse(message, tone, context = '') {
  try {
    // Get tone details if available
    let toneDetails = null;
    try {
      // Try to find by ID first
      toneDetails = await Tone.findByPk(tone);
      
      // If not found by ID, try to find by name (for system tones)
      if (!toneDetails) {
        toneDetails = await Tone.findOne({ 
          where: { name: { [Op.iLike]: tone } } 
        });
      }
    } catch (error) {
      // If the tone lookup fails, just proceed with the tone name
      console.warn('Tone lookup failed, using tone name directly:', error);
    }
    
    const prompt = createPrompt(
      message, 
      toneDetails?.name || tone, 
      context, 
      toneDetails?.parameters || {}
    );
    
    const response = await axios.post(`${OLLAMA_API_URL}/generate`, {
      model: DEFAULT_MODEL,
      prompt,
      stream: false
    });
    
    return response.data.response;
  } catch (error) {
    console.error('Error generating response from Ollama:', error);
    throw new Error('Failed to generate response');
  }
}

/**
 * Generate multiple responses with different tones
 * @param {string} message - The user's message
 * @param {Array<string>} tones - Array of desired tones
 * @param {string} context - Additional context about the conversation
 * @returns {Promise<Object>} - Object with tone-response pairs
 */
async function generateMultipleTones(message, tones, context = '') {
  try {
    const responses = {};
    
    // Generate responses for each tone in parallel
    const promises = tones.map(async (tone) => {
      const response = await generateResponse(message, tone, context);
      responses[tone] = response;
    });
    
    await Promise.all(promises);
    return responses;
  } catch (error) {
    console.error('Error generating multiple responses:', error);
    throw new Error('Failed to generate multiple responses');
  }
}

/**
 * Create a prompt for the AI model
 */
function createPrompt(message, tone, context, parameters = {}) {
  // Build a description of the tone from parameters if they exist
  let toneDescription = '';
  if (Object.keys(parameters).length > 0) {
    toneDescription = `This tone has the following characteristics:\n`;
    for (const [key, value] of Object.entries(parameters)) {
      toneDescription += `- ${key}: ${value}\n`;
    }
  }

  return `
You are a helpful assistant that generates responses in different tones.

${context ? `Context: ${context}\n` : ''}
${toneDescription ? `${toneDescription}\n` : ''}

Someone said: "${message}"

Please generate a response in a ${tone} tone. The response should be natural, appropriate, and directly usable in conversation.
`;
}

module.exports = {
  generateResponse,
  generateMultipleTones
};
