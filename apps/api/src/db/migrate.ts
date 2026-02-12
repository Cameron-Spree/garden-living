import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './pool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.resolve(__dirname, '../../migrations');

async function run() {
  await pool.query(`
    create table if not exists schema_migrations (
      id text primary key,
      applied_at timestamptz not null default now()
    )
  `);

  const files = (await fs.readdir(migrationsDir))
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const id = file;
    const exists = await pool.query('select 1 from schema_migrations where id = $1', [id]);
    if (exists.rowCount) continue;

    const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8');
    await pool.query('begin');
    try {
      await pool.query(sql);
      await pool.query('insert into schema_migrations (id) values ($1)', [id]);
      await pool.query('commit');
      console.log(`Applied migration: ${id}`);
    } catch (error) {
      await pool.query('rollback');
      throw error;
    }
  }

  await pool.end();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
