require('dotenv').config();
const { Client } = require('pg');

async function createDatabase() {
  // Connect to the default postgres database first
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'postgres', // Connect to default database
    password: String(process.env.DB_PASSWORD),
    port: process.env.DB_PORT || 5432,
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    // Create the database
    await client.query(`
      CREATE DATABASE toneshift
      WITH 
      OWNER = postgres
      ENCODING = 'UTF8'
      CONNECTION LIMIT = -1;
    `);
    
    console.log('Database "toneshift" created successfully');
    
  } catch (err) {
    if (err.code === '42P04') {
      console.log('Database "toneshift" already exists');
    } else {
      console.error('Error creating database:', err);
    }
  } finally {
    await client.end();
  }
}

createDatabase()
  .then(() => console.log('Database initialization complete'))
  .catch(err => console.error('Database initialization failed:', err));
