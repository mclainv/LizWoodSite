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
  const {modelType, items} = JSON.parse(event.body);
  console.log('items: ', items, '\n\n');
  // reuse existing model or compile a new one with explicit collection name
  const Position = mongoose.models[modelType]
    ? mongoose.model(modelType)
    : mongoose.model(modelType, PositionSchema, modelType);
  await Position.deleteMany({});
  await Position.insertMany(items);

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true }),
  };
};