const mongoose = require('mongoose');
require('dotenv').config();

// --- Database Connection Cache ---
let isConnected = false;

async function connectToDatabase() {
  if (isConnected) {
    console.log('=> using existing database connection');
    return;
  }
  console.log('=> using new database connection');
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
  // No need to define specific models here if just fetching all
}

// --- Netlify Function Handler ---
exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let modelType;
  try {
    const body = JSON.parse(event.body || '{}');
    modelType = body.modelType;
    if (!modelType) {
      return { statusCode: 400, body: 'Bad Request: Missing modelType' };
    }
  } catch (e) {
    console.error('Error parsing request body:', e);
    return { statusCode: 400, body: 'Bad Request: Invalid JSON' };
  }

  try {
    await connectToDatabase();

    // Construct collection names dynamically
    const draggableCollectionName = modelType + "Draggables";
    const fixedCollectionName = modelType + "Fixeds";

    console.log(`Fetching from collections: ${draggableCollectionName}, ${fixedCollectionName}`);

    // Get collection references
    const draggablesCollection = mongoose.connection.db.collection(draggableCollectionName);
    const fixedsCollection = mongoose.connection.db.collection(fixedCollectionName);

    // Fetch all documents from each collection
    // Using .toArray() to get the results as arrays
    const draggableImages = await draggablesCollection.find({}).toArray();
    const fixedImages = await fixedsCollection.find({}).toArray();
    console.log(`Fetched ${draggableImages.length} draggable and ${fixedImages.length} fixed images.`);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        draggableImages: draggableImages || [], // Ensure array even if null/undefined
        fixedImages: fixedImages || []       // Ensure array even if null/undefined
      }),
      headers: { 'Content-Type': 'application/json' },
    };

  } catch (error) {
    console.error('Error fetching positions:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch positions', details: error.message }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
};