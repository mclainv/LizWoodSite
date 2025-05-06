const mongoose = require('mongoose');
const fs = require('fs').promises; // Use promises version of fs
const path = require('path');
// Try accessing .default for CommonJS compatibility
const { imageSizeFromFile } = require('image-size/fromFile')
require('dotenv').config();

// --- Configuration --- PLEASE EDIT THESE ---
const TARGET_FOLDER = '../lizwood-client/public/conceptdevelopment'; // <<< Path to the folder containing images (relative to this script)
const MODEL_TYPE = 'Concepts';      // <<< Category name (e.g., 'Home', 'Direction') - used for collection name and asset path
const COLLECTION_SUFFIX = 'Draggables'; // <<< Set to 'Draggables' or 'Fixeds'
const ASSETS_BASE_PATH = '/conceptdevelopment';   // <<< Base path where images are served from (relative to public root)
// --- End Configuration ---

// Schema definition (make sure it matches your functions)
const ImagePositionSchema = new mongoose.Schema({
  path: { type: String, required: true, unique: true },
  alt: String,
  ogWidth: Number,
  ogHeight: Number,
  defaultPosition: {
    x: Number,
    y: Number,
    z: Number,
    rotated: Number,
    width: Number,
    height: Number,
    pin: { // Nested pin structure
      src: String,
      ogWidth: Number, // Add fields expected by schema based on pin object below
      ogHeight: Number,
      initialPos: {
        x: Number,
        y: Number,
        rotated: Number,
        width: Number,
        height: Number
      }
    }
  },
});

// Predefined Pin object (adjust as needed)
const pinData = {
  src: "/tapes/tape5.png", // Path to pin image
  ogWidth: 160,           // Pin's own ogWidth
  ogHeight: 50,           // Pin's own ogHeight
  initialPos: {           // Pin's initial state WITHIN the main image's defaultPosition
    x: 0,
    y: 0,
    rotated: 0,
    width: 80,
    height: 25
  }
};

async function addImagesFromFolder() {
  console.log(`Starting script for folder: ${TARGET_FOLDER}, modelType: ${MODEL_TYPE}, collection: ${COLLECTION_SUFFIX}`);

  try {
    // 1. Connect to Database
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    // 2. Read image files from target folder
    const files = await fs.readdir(TARGET_FOLDER);
    const imageFiles = files.filter(file => /\.(jpe?g|png|gif|webp|svg|JPG|PNG)$/i.test(file)); // Filter for image extensions
    console.log(`Found ${imageFiles.length} image files.`);

    if (imageFiles.length === 0) {
      console.log('No image files found to process.');
      return;
    }

    // 3. Prepare operations for bulkWrite
    const operations = [];
    for (const file of imageFiles) {
      const filePath = path.join(TARGET_FOLDER, file);
      try {
        const dimensions = await imageSizeFromFile(filePath); // Get image dimensions
        const parsedPath = path.parse(file);
        // Replace hyphens with spaces for alt text
        const altText = parsedPath.name.replace(/-/g, ' '); 
        // Construct the path for the database (relative to public assets)
        // Example: /assets/Home/image.png
        const dbPath = path.join(ASSETS_BASE_PATH, file).replace(/\\/g, '/');

        const imageDoc = {
          path: dbPath,
          alt: altText,
          ogWidth: dimensions.width,
          ogHeight: dimensions.height,
          defaultPosition: {
            x: 0,
            y: 0,
            z: 1, // Default z-index
            rotated: 0,
            width: dimensions.width/10,  // Default display width = original width
            height: dimensions.height/10, // Default display height = original height
            pin: pinData // Assign the predefined pin object
          }
        };

        operations.push({
          updateOne: {
            filter: { path: imageDoc.path }, // Use path to find existing docs
            update: { $set: imageDoc },     // Set the entire document data
            upsert: true                    // Insert if not found
          }
        });

      } catch (err) {
        console.error(`Skipping file ${file}: Could not get dimensions or process. Error: ${err.message}`);
      }
    }

    // 4. Execute Bulk Write
    if (operations.length > 0) {
      const collectionName = `${MODEL_TYPE}${COLLECTION_SUFFIX}`;
      const collection = mongoose.connection.db.collection(collectionName);
      console.log(`Executing ${operations.length} operations on collection '${collectionName}'...`);
      const result = await collection.bulkWrite(operations);
      console.log('BulkWrite result:', result);
    } else {
      console.log('No valid operations to execute.');
    }

  } catch (error) {
    console.error('Script failed:', error);
  } finally {
    // 5. Disconnect
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

// Run the script
addImagesFromFolder();