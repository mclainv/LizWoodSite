const mongoose = require('mongoose');
require('dotenv').config();

// cache the connection to database across calls so u dont connect many times
let isConnected = false;
// let Position;
const ImagePositionSchema = new mongoose.Schema({
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
    pin: {
      src: String,
      x: Number,
      y: Number,
      rotated: Number,
      width: Number,
      height: Number
    }
  },

});
// could be used with "ModelType"
// const HomePageDraggable = mongoose.models.HomePageDraggable || mongoose.model('HomePageDraggable', ImagePositionSchema, 'homepagedraggables');
// const HomePageFixed = mongoose.models.HomePageFixed || mongoose.model('HomePageFixed', ImagePositionSchema, 'homepagefixeds');

module.exports.handler = async function(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;

  if (!isConnected) {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  let { modelType, draggableItems, fixedItems } = JSON.parse(event.body);

  const draggableCollection = mongoose.connection.db.collection(modelType + "Draggables");
  const fixedCollection = mongoose.connection.db.collection(modelType + "Fixeds");
  const draggableOps = draggableItems.map(item => ({
    updateOne: {
      filter: { _id: item._id }, // Find document by path
      update: { $set: item },      // Update the entire document with new data
      upsert: true                 // If not found, insert it
    }
  }));
  
  const fixedOps = fixedItems.map(item => ({
    updateOne: {
      filter: { _id: item._id }, // Find document by path
      update: { $set: item },     
      upsert: true                
    }
  }));

  let draggableResult, fixedResult;
  if (draggableOps.length > 0) {
    console.log(`Executing ${draggableOps.length} draggable operations...`);
    draggableResult = await draggableCollection.bulkWrite(draggableOps);
    console.log('Draggable bulkWrite result:', draggableResult);
  }
  if (fixedOps.length > 0) {
    console.log(`Executing ${fixedOps.length} fixed operations...`);
    fixedResult = await fixedCollection.bulkWrite(fixedOps);
    console.log('Fixed bulkWrite result:', fixedResult);
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, draggableResult, fixedResult }),
  };
};