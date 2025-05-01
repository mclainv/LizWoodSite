// Add imports for Mongoose and dotenv
const mongoose = require('mongoose');
// require('dotenv').config();
// cache the Mongoose connection and models across invocations
let isConnected = false;
// define a reusable schema for dynamic Position models
// const PositionSchema = new mongoose.Schema({
//   path: String,
//   alt: String,
//   ogWidth: Number,
//   ogHeight: Number,
//   defaultPosition: {
//     x: Number,
//     y: Number,
//     z: Number,
//     rotated: Number,
//     width: Number,
//     height: Number,
//   },
// });

module.exports.handler = async function(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;

  if (!isConnected) {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
  }
  if (isConnected) {
    console.log("Connected to MongoDB");
  }

  // parse dynamic modelType from the JSON body
  let modelType;
  try {
    ({ modelType } = JSON.parse(event.body || '{}'));
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }
  if (!modelType) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing modelType' }) };
  }

  // fetch the single document with all image items
  const collection = mongoose.connection.db.collection(modelType);
  
  const dragDoc = await collection.findOne({ _id: 'draggable-images' });
  const fixedDoc = await collection.findOne({ _id: 'fixed-images' });
  
  const draggableImages = Array.isArray(dragDoc?.items) ? dragDoc.items : [];
  const fixedImages = Array.isArray(fixedDoc?.items) ? fixedDoc.items : [];
  return {
    statusCode: 200,
    // return both arrays as named properties
    body: JSON.stringify({ draggableImages, fixedImages }),
  };
};
