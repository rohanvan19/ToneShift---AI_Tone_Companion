const { Sequelize } = require('sequelize');
require('dotenv').config();

// Log the connection details for debugging (remove in production)
console.log('Connecting to database with:');
console.log(`  DB_NAME: ${process.env.DB_NAME}`);
console.log(`  DB_USER: ${process.env.DB_USER}`);
console.log(`  DB_HOST: ${process.env.DB_HOST}`);
console.log(`  DB_PORT: ${process.env.DB_PORT}`);
// Don't log the actual password, just check if it exists
console.log(`  DB_PASSWORD: ${process.env.DB_PASSWORD ? 'Provided' : 'Missing'}`);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      // Force string password
      password: String(process.env.DB_PASSWORD)
    }
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error; // Re-throw to allow the caller to handle it
  }
};

module.exports = { sequelize, testConnection };