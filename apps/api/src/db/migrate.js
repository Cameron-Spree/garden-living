import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is required for migrations');
  process.exit(1);
}

let pg;
try {
  pg = await import('pg');
} catch {
  console.error('Missing pg package. Run: npm install -w apps/api');
  process.exit(1);
}

const { Pool } = pg.default;
const pool = new Pool({ connectionString: databaseUrl });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.resolve(__dirname, '../../migrations');

await pool.query(`create table if not exists schema_migrations (id text primary key, applied_at timestamptz not null default now())`);
const files = (await fs.readdir(migrationsDir)).filter((f) => f.endsWith('.sql')).sort();

for (const file of files) {
  const applied = await pool.query('select 1 from schema_migrations where id = $1', [file]);
  if (applied.rowCount) continue;
  const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8');
  await pool.query('begin');
  try {
    await pool.query(sql);
    await pool.query('insert into schema_migrations (id) values ($1)', [file]);
    await pool.query('commit');
    console.log(`Applied migration ${file}`);
  } catch (error) {
    await pool.query('rollback');
    throw error;
  }
}

await pool.end();
