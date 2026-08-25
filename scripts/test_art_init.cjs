const fs = require('fs');
const path = require('path');

// Ensure directory exists
const outDir = path.resolve('public/assets/gi-images');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log("Generating 50 high-detail standalone GI product artworks...");
