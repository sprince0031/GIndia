const fs = require('fs');
const svg = fs.readFileSync('public/assets/in.svg', 'utf8');
const ids = ['INWB', 'INOR', 'INAS', 'INGJ', 'INAP', 'INKL', 'INTN', 'INAN', 'INLD'];
ids.forEach(id => {
  const matches = [...svg.matchAll(new RegExp(`(<[a-zA-Z0-9]+[^>]*id=["']${id}["'][^>]*>)`, 'gi'))];
  console.log(id, '-->', matches.map(m => m[1]));
});
