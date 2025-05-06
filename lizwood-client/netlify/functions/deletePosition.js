// netlify/functions/deletePosition.js
const mongoose = require('mongoose');
require('dotenv').config();

let isConnected = false;
// ... (connectToDatabase function similar to get/save) ...
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

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { modelType, itemType, idToDelete } = JSON.parse(event.body);

    if (!modelType || !itemType || !idToDelete) {
      return { statusCode: 400, body: 'Missing required fields (modelType, itemType, idToDelete)' };
    }

    await connectToDatabase();

    const collectionName = `${modelType}${itemType === 'draggable' ? 'Draggables' : 'Fixeds'}`;
    const collection = mongoose.connection.db.collection(collectionName);

    console.log(`Attempting to delete document with _id: ${idToDelete} from collection: ${collectionName}`);

    const result = await collection.deleteOne({ _id: new mongoose.Types.ObjectId(idToDelete) }); // Convert string ID to ObjectId

    if (result.deletedCount === 1) {
      console.log(`Successfully deleted document with _id: ${idToDelete}`);
      return { statusCode: 200, body: JSON.stringify({ ok: true, message: 'Document deleted' }) };
    } else {
      console.warn(`Document not found or not deleted for _id: ${idToDelete}`);
      // Return success even if not found, as the goal is for it to be gone
      return { statusCode: 200, body: JSON.stringify({ ok: true, message: 'Document not found or already deleted' }) };
    }

  } catch (error) {
    console.error('Error deleting position:', error);
    // Check if it's an invalid ObjectId format error
     if (error.name === 'BSONTypeError') {
        return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'Invalid ID format provided.'}) };
     }
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: error.message }) };
  }
};