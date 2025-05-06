const mongoose = require('mongoose');
require('dotenv').config();

// cache the connection to database across calls so u dont connect many times
let isConnected = false;

module.exports.handler = async function(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;

  if (!isConnected) {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  // Assume items now have structure { _id: string, positionData: PositionState }
  let { modelType, draggableItems, fixedItems } = JSON.parse(event.body);

  const draggableCollection = mongoose.connection.db.collection(modelType + "Draggables");
  const fixedCollection = mongoose.connection.db.collection(modelType + "Fixeds");
  
  // Function to create update operations
  const createUpdateOps = (items) => items.map(item => {
    if (!item._id || !item.positionData) {
        console.warn('Skipping item due to missing _id or positionData:', item);
        return null; // Skip invalid items
    }
    return {
        updateOne: {
            filter: { _id: item._id }, 
            // Update ONLY the defaultPosition field with the received positionData
            update: { $set: { defaultPosition: item.positionData } },     
        }
    };
  }).filter(op => op !== null); // Remove null ops from skipped items

  const draggableOps = createUpdateOps(draggableItems);
  const fixedOps = createUpdateOps(fixedItems);

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