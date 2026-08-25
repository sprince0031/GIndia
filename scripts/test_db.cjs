const fs = require('fs');
const db = JSON.parse(fs.readFileSync('data/gi_database.json', 'utf8'));
console.log('States in JSON keys:', Object.keys(db.states));
console.log('Sample state INWB:', db.states['INWB']);
console.log('Products for INWB:', db.products.filter(p => p.stateId === 'INWB'));
