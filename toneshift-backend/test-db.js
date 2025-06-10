require('dotenv').config();
const { Client } = require('pg');

console.log('Testing direct PostgreSQL connection');
console.log(`DB_USER: ${process.env.DB_USER}`);
console.log(`DB_HOST: ${process.env.DB_HOST}`);
console.log(`DB_NAME: ${process.env.DB_NAME}`);
console.log(`DB_PORT: ${process.env.DB_PORT || 5432}`);
console.log(`DB_PASSWORD exists: ${!!process.env.DB_PASSWORD}`);

// Try with PostgreSQL 17
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME || 'postgres', // Default to postgres database if toneshift doesn't exist yet
  password: String(process.env.DB_PASSWORD),
  port: 5433, // PostgreSQL 17 likely uses 5433 since 13 is on 5432
});

console.log('Attempting to connect...');
client.connect()
  .then(() => {
    console.log('Connected successfully!');
    return client.query('SELECT NOW(), version()');
  })
  .then(res => {
    console.log('Current time from database:', res.rows[0].now);
    console.log('PostgreSQL version:', res.rows[0].version);
    client.end();
  })
  .catch(err => {
    console.error('Connection error:', err);
    
    // Try with default port 5432 (PostgreSQL 13) if the first attempt failed
    console.log('\nRetrying with PostgreSQL 13 on port 5432...');
    const clientV13 = new Client({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME || 'postgres',
      password: String(process.env.DB_PASSWORD),
      port: 5432
    });
    
    clientV13.connect()
      .then(() => {
        console.log('Connected successfully to PostgreSQL 13!');
        return clientV13.query('SELECT NOW(), version()');
      })
      .then(res => {
        console.log('Current time from database:', res.rows[0].now);
        console.log('PostgreSQL version:', res.rows[0].version);
        clientV13.end();
      })
      .catch(secondErr => {
        console.error('Second connection attempt also failed:', secondErr);
        process.exit(1);
      });
  });