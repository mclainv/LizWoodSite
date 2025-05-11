const fs = require('fs/promises');
const path = require('path');
const { imageSizeFromFile } = require('image-size/fromFile');

const imagesDir = path.join(__dirname, '../lizwood-client', 'public', 'assets');
const outputArray = [];

async function processImages() {
  try {
    const files = await fs.readdir(imagesDir);

    for (const file of files) {
      const filePath = path.join(imagesDir, file);
      try {
        const stats = await fs.stat(filePath);
        if (stats.isFile()) {
          // Check extension to avoid non-image files if necessary
          const ext = path.extname(file).toLowerCase();
          if (['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext)) {
             const dimensions = await imageSizeFromFile(filePath);
             if (dimensions) {
                outputArray.push({
                  src: `/images/${file}`, // Path relative to public root
                  ogWidth: dimensions.width,
                  ogHeight: dimensions.height,
                });
             } else {
                 console.warn(`Could not get dimensions for: ${file}`);
             }
          } else {
             console.warn(`Skipping non-image file: ${file}`);
          }
        }
      } catch (err) {
        console.error(`Error processing file ${file}:`, err);
      }
    }

    // Log the final array as a JSON string
    console.log(JSON.stringify(outputArray, null, 2));

  } catch (err) {
    console.error('Error reading images directory:', err);
  }
}

processImages(); 