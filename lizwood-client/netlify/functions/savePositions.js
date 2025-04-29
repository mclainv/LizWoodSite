import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config();

// cache the client across invocations
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

  const data = JSON.parse(event.body); // your array of positions
  // example: replace all entries
  await coll.deleteMany({});
  await coll.insertMany(data);

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true }),
  };
};