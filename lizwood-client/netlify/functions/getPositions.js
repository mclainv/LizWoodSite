// Add imports for Mongoose and dotenv
const mongoose = require('mongoose');
require('dotenv').config();
// cache the Mongoose connection and models across invocations
let isConnected = false;
// define a reusable schema for dynamic Position models
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
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
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

  // get or compile the Mongoose model for this collection
  const Position = mongoose.models[modelType]
    ? mongoose.model(modelType)
    : mongoose.model(modelType, PositionSchema, modelType);

  // fetch all documents, excluding MongoDB's internal _id
  const data = await Position.find({}).select('-_id').lean();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
