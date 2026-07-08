const { Client } = require('pg');
const fs = require('fs');

const envPath = '.env.local';
const envFile = fs.readFileSync(envPath, 'utf8');

let connectionString = '';

envFile.split('\n').forEach(line => {
  if (line.startsWith('DATABASE_URL=')) {
    connectionString = line.split('=')[1].trim().replace(/^"|"$/g, '');
  }
});

async function seed() {
  if (!connectionString) {
    console.error("No DATABASE_URL found in .env.local");
    process.exit(1);
  }

  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    const sql = fs.readFileSync('supabase/seed-data.sql', 'utf8');
    await client.query(sql);
    console.log("Seed data inserted successfully.");
  } catch (err) {
    console.error("Error seeding data:", err);
  } finally {
    await client.end();
  }
}

seed();
