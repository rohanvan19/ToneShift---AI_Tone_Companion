// filepath: c:\Users\vanma\StudioProjects\ToneShift\src\models\Conversation.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  context: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  messages: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  relationship: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

// Establish relationships
Conversation.belongsTo(User);
User.hasMany(Conversation);

module.exports = Conversation;