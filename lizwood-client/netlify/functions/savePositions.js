const mongoose = require('mongoose');
require('dotenv').config();

// cache the connection to database across calls so u dont connect many times
let isConnected = false;
// let Position;
const PositionSchema = new mongoose.Schema({
  path: String,
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
  },
});

module.exports.handler = async function(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;

  if (!isConnected) {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
  }
  const { modelType, draggableItems, fixedItems } = JSON.parse(event.body);
  // store all images in a single document called 'draggable-images'
  const collection = mongoose.connection.db.collection(modelType);
  await collection.updateOne(
    { _id: 'draggable-images' },
    { $set: { items: draggableItems } },
    { upsert: true }
  );
  await collection.updateOne(
    { _id: 'fixed-images' },
    { $set: { items: fixedItems } },
    { upsert: true }
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true }),
  };
};