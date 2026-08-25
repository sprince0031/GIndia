const fs = require('fs');
const db = JSON.parse(fs.readFileSync('data/gi_database.json', 'utf8'));

const emptyStates = [];
for (const stateId of Object.keys(db.states)) {
  const prods = db.products.filter(p => p.stateId === stateId);
  if (prods.length === 0) {
    emptyStates.push(stateId);
  }
}
console.log('Empty product states count:', emptyStates.length, emptyStates);
