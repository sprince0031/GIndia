const fs = require('fs');
const db = JSON.parse(fs.readFileSync('data/gi_database.json', 'utf8'));
console.log('Total products:', db.products.length);
db.products.forEach((p, idx) => {
  console.log(`${idx + 1}. [${p.stateId}] ${p.id} (${p.category}) -> ${p.name}`);
});
