const Tone = require('../models/Tone');

const defaultTones = [
  {
    name: 'Professional',
    description: 'Formal, clear, and business-appropriate responses.',
    isSystem: true,
    parameters: { formality: 'high', emotion: 'neutral' }
  },
  {
    name: 'Casual',
    description: 'Relaxed, conversational, and friendly responses.',
    isSystem: true,
    parameters: { formality: 'low', emotion: 'positive' }
  },
  {
    name: 'Friendly',
    description: 'Warm, supportive, and approachable responses.',
    isSystem: true,
    parameters: { formality: 'medium', emotion: 'positive' }
  },
  {
    name: 'Funny',
    description: 'Humorous, light, and entertaining responses.',
    isSystem: true,
    parameters: { formality: 'low', emotion: 'humorous' }
  },
  {
    name: 'Formal',
    description: 'Highly structured, respectful, and proper responses.',
    isSystem: true,
    parameters: { formality: 'very high', emotion: 'neutral' }
  },
  {
    name: 'Empathetic',
    description: 'Understanding, compassionate, and supportive responses.',
    isSystem: true,
    parameters: { formality: 'medium', emotion: 'caring' }
  },
  {
    name: 'Direct',
    description: 'Straightforward, concise, and to-the-point responses.',
    isSystem: true,
    parameters: { formality: 'medium', emotion: 'neutral' }
  },
  {
    name: 'Enthusiastic',
    description: 'Excited, energetic, and passionate responses.',
    isSystem: true,
    parameters: { formality: 'medium', emotion: 'excited' }
  }
];

const seedSystemTones = async () => {
  try {
    // Check if system tones already exist
    const existingSystemTones = await Tone.findAll({ where: { isSystem: true } });
    
    if (existingSystemTones.length === 0) {
      // No system tones yet, create them
      await Tone.bulkCreate(defaultTones);
      console.log('System tones created successfully');
    } else {
      console.log('System tones already exist, skipping seed');
    }
  } catch (error) {
    console.error('Error seeding system tones:', error);
  }
};

module.exports = { seedSystemTones };