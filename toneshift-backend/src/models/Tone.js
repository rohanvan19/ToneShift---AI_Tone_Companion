const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Tone = sequelize.define('Tone', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Is this a system tone or user-created tone
  isSystem: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // Additional tone parameters (could be used for fine-tuning)
  parameters: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
});

// Establish relationships - users can create custom tones
Tone.belongsTo(User, { as: 'creator', foreignKey: 'creatorId' });
User.hasMany(Tone, { as: 'customTones', foreignKey: 'creatorId' });

module.exports = Tone;