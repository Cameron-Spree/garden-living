import fs from 'node:fs';

const required = [
  'apps/api/src/index.js',
  'apps/api/migrations/001_init.sql',
  'apps/mobile/App.js',
  'docker-compose.yml',
  'README.md'
];

for (const file of required) {
  if (!fs.existsSync(file)) {
    console.error(`Missing required file: ${file}`);
    process.exit(1);
  }
}

console.log('lint: project structure checks passed');
