const fs = require('fs');
const svg = fs.readFileSync('public/assets/in.svg', 'utf8');

const pathMatches = [...svg.matchAll(/<path[^>]+id="([^"]+)"[^>]*name="([^"]+)"/g)];
console.log('Path elements with ID and Name:', pathMatches.length);

const statePathCounts = {};
pathMatches.forEach(m => {
  const id = m[1].toUpperCase();
  statePathCounts[id] = (statePathCounts[id] || 0) + 1;
});
console.log('Path counts per state ID:', statePathCounts);
