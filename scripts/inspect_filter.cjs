const fs = require('fs');
const db = JSON.parse(fs.readFileSync('data/gi_database.json', 'utf8'));

console.log("Unique categories in db:", [...new Set(db.products.map(p => p.category))]);

for (const cat of ['Handicraft', 'Handicrafts', 'Agricultural', 'Food Stuff', 'Manufactured', 'Natural Goods']) {
  const prods = db.products.filter(p => p.category === cat || (cat === 'Handicrafts' && p.category === 'Handicraft'));
  const states = [...new Set(prods.map(p => p.stateId))];
  console.log(`Category: "${cat}" (${prods.length} products) -> States:`, states.join(', '));
}