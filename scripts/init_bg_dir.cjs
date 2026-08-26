const fs = require('fs');
const path = require('path');
const bgDir = path.resolve('public/assets/gi-images/backgrounds');
if (!fs.existsSync(bgDir)) {
  fs.mkdirSync(bgDir, { recursive: true });
}
console.log("Backgrounds directory initialized at:", bgDir);