const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'public', 'assets');

function compressDir(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      compressDir(fullPath);
    } else if (item.match(/\.(png|jpg|jpeg)$/i) && !item.includes('webp')) {
      const outputPath = fullPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
      sharp(fullPath)
        .webp({ quality: 80 })
        .toFile(outputPath)
        .then(() => {
          const origSize = stat.size;
          const newSize = fs.statSync(outputPath).size;
          const savings = Math.round((1 - newSize / origSize) * 100);
          console.log(`${item}: ${(origSize/1024).toFixed(0)}KB -> ${(newSize/1024).toFixed(0)}KB (${savings}% smaller)`);
        })
        .catch(err => console.error(`Error: ${item}: ${err.message}`));
    }
  }
}

compressDir(assetsDir);
console.log('Image compression complete');
