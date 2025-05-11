const mongoose = require('mongoose');
const fs = require('fs').promises; // Use promises version of fs
const path = require('path');
// Try accessing .default for CommonJS compatibility
const { imageSizeFromFile } = require('image-size/fromFile')
require('dotenv').config();

// --- Configuration --- PLEASE EDIT THESE ---
const TARGET_FOLDER = '../lizwood-client/public/production/new'; // <<< Path to the folder containing images (relative to this script)
const MODEL_TYPE = 'Production';      // <<< Category name (e.g., 'Home', 'Direction') - used for collection name and asset path
const COLLECTION_SUFFIX = 'Fixed'; // <<< Set to 'Draggables' or 'Fixeds'
const ASSETS_BASE_PATH = '/production';   // <<< Base path where images are served from (relative to public root)
// --- End Configuration ---

// Schema definition (make sure it matches your functions)
const ImagePositionSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
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
      ogWidth: Number,
      ogHeight: Number,
      initialPos: {
        x: Number,
        y: Number,
        rotated: Number,
        width: Number,
        height: Number
      }
    }
  }
}, { 
  _id: true,
  id: false,
  versionKey: false,
  timestamps: false
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

// Create model with custom ID generation
const createModel = (collectionName) => {
  return mongoose.model(collectionName, ImagePositionSchema, collectionName);
};

async function addImagesFromFolder() {
  console.log(`Starting script for folder: ${TARGET_FOLDER}, modelType: ${MODEL_TYPE}, collection: ${COLLECTION_SUFFIX}`);

  try {
    // 1. Connect to Database
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    // Create model
    const collectionName = `${MODEL_TYPE}${COLLECTION_SUFFIX}`;
    const ImageModel = createModel(collectionName);

    // 2. Read image files from target folder
    const files = await fs.readdir(TARGET_FOLDER);
    const imageFiles = files.filter(file => /\.(jpe?g|png|gif|webp|svg|JPG|PNG)$/i.test(file));
    console.log(`Found ${imageFiles.length} image files.`);

    if (imageFiles.length === 0) {
      console.log('No image files found to process.');
      return;
    }

    // 3. Process each image
    for (const file of imageFiles) {
      const filePath = path.join(TARGET_FOLDER, file);
      try {
        const dimensions = await imageSizeFromFile(filePath);
        const parsedPath = path.parse(file);
        const altText = parsedPath.name.replace(/-/g, ' ');
        const dbPath = path.join(ASSETS_BASE_PATH, file).replace(/\\/g, '/');

        const imageDoc = {
          path: dbPath,
          alt: altText,
          ogWidth: dimensions.width,
          ogHeight: dimensions.height,
          defaultPosition: {
            x: 0,
            y: 0,
            z: 1,
            rotated: 0,
            width: dimensions.width/10,
            height: dimensions.height/10
          }
        };

        if(COLLECTION_SUFFIX === 'Draggables') {
          imageDoc.defaultPosition.pin = pinData;
        }

        // Use findOneAndUpdate with upsert
        await ImageModel.findOneAndUpdate(
          { path: imageDoc.path },
          imageDoc,
          { upsert: true, new: true }
        );

      } catch (err) {
        console.error(`Skipping file ${file}: Could not get dimensions or process. Error: ${err.message}`);
      }
    }

    console.log('All images processed successfully.');

  } catch (error) {
    console.error('Script failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

// Run the script
addImagesFromFolder();