require('dotenv').config();
const { Client } = require('pg');

async function queryDatabase() {
  // Connect directly to the toneshift database
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
  });

  try {
    console.log('Connecting to toneshift database...');
    await client.connect();
    console.log('Connected successfully!');
    
    // Example: List all tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('\nTables in the database:');
    tablesResult.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });
    
    // Example: Count records in Users table
    const userCountResult = await client.query('SELECT COUNT(*) FROM "Users"');
    console.log(`\nNumber of users: ${userCountResult.rows[0].count}`);
    
    // Example: List system tones
    const tonesResult = await client.query('SELECT name, description FROM "Tones" WHERE "isSystem" = true');
    console.log('\nSystem tones:');
    tonesResult.rows.forEach(row => {
      console.log(`- ${row.name}: ${row.description}`);
    });
    
  } catch (error) {
    console.error('Database query error:', error);
  } finally {
    await client.end();
    console.log('\nDatabase connection closed');
  }
}

queryDatabase().catch(console.error);