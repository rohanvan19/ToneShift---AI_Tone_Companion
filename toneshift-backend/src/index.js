const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize, testConnection } = require('./config/database');
const { seedSystemTones } = require('./utils/seedTones');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Conversation = require('./models/Conversation');
const Relationship = require('./models/Relationship');
const Tone = require('./models/Tone');

// Import routes
const userRoutes = require('./routes/userRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const relationshipRoutes = require('./routes/relationshipRoutes');
const responseRoutes = require('./routes/responseRoutes');
const toneRoutes = require('./routes/toneRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('ToneShift API is running');
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/relationships', relationshipRoutes);
app.use('/api/responses', responseRoutes);
app.use('/api/tones', toneRoutes);

// Initialize server
async function startServer() {
  try {
    // Test database connection
    await testConnection();
    
    // Sync database models
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Database synced successfully');
    
    // Seed initial data
    await seedSystemTones();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();