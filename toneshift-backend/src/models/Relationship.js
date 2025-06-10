const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Relationship = sequelize.define('Relationship', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'personal' // personal, professional, family, etc.
  },
  context: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  preferredTones: {
    type: DataTypes.JSONB,
    defaultValue: ['friendly', 'respectful']
  },
  additionalInfo: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
});

// Establish relationships
Relationship.belongsTo(User);
User.hasMany(Relationship);

module.exports = Relationship;