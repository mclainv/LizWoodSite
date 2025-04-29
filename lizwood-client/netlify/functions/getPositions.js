import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Cache the MongoDB client across function invocations
let clientPromise;

exports.handler = async function(event) {
  if (!clientPromise) {
    clientPromise = mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  const client = await clientPromise;
  const db     = client.db(process.env.MONGODB_DB);
  const coll   = db.collection('positions');

  // Fetch all stored positions (omit MongoDB's internal _id)
  const data = await coll.find({}).project({ _id: 0 }).toArray();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}; 