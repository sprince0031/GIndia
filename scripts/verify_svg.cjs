const fs = require('fs');
const svg = fs.readFileSync('public/assets/in.svg', 'utf8');
const db = JSON.parse(fs.readFileSync('data/gi_database.json', 'utf8'));
const missing = [];
for (const stateId of Object.keys(db.states)) {
  if (!svg.includes(`id="${stateId}"`)) {
    missing.push(stateId);
  }
}
if (missing.length === 0) {
  console.log('✅ All 36 state IDs match in.svg perfectly!');
} else {
  console.error('Missing IDs in SVG:', missing);
  process.exit(1);
}
