// Apply Supabase migrations via direct Postgres connection.
// Usage: DB_URL="postgresql://..." node script/apply-schema.js
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const DB_URL = process.env.DB_URL;
if (!DB_URL) {
  console.error('Missing DB_URL env var.');
  process.exit(1);
}

const migrationsDir = path.join(__dirname, '..', 'database', 'migrazioni');
const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

if (!files.length) {
  console.error('No migration files in', migrationsDir);
  process.exit(1);
}

(async () => {
  const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log('Connected.');
  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    console.log(`\n>>> Applying ${file} (${sql.length} chars)`);
    try {
      await client.query(sql);
      console.log(`    OK`);
    } catch (err) {
      console.error(`    FAILED: ${err.message}`);
      await client.end();
      process.exit(1);
    }
  }
  await client.end();
  console.log('\nDone.');
})().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
