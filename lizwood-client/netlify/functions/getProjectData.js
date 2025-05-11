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

  let category;
  let project;
  try {
    const body = JSON.parse(event.body || '{}');
    category = body.category;
    project = body.project;
    if (!category || !project) {
      return { statusCode: 400, body: 'Bad Request: Missing category or project' };
    }
  } catch (e) {
    console.error('Error parsing request body:', e);
    return { statusCode: 400, body: 'Bad Request: Invalid JSON' };
  }

  try {
    await connectToDatabase();

    // Construct collection names dynamically
    const documentPath = category + "/" + project;

    console.log(`Fetching document: ${documentPath}`);

    // Get collection references
    const projectCollection = mongoose.connection.db.collection("Projects");

    // Fetch all documents from each collection
    // Using .toArray() to get the results as arrays
    const projectData = await projectCollection.findOne({ path: documentPath });
    if (!projectData) {
      return { statusCode: 404, body: 'Document not found' };
    }
    console.log(`Fetched project data: ${projectData}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ data: projectData }),
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