import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function getWeighbridgeCollection() {
  const client = await clientPromise;
  return client.db('promatic').collection('weighbridge_data');
}

export async function getGRNCollection() {
  const client = await clientPromise;
  return client.db('promatic').collection('grn_records');
}