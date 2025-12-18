// backend/seed.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'appdb';

const parties = [
  { PTY_ID: '01', PTY_FirstName: 'Muppidi', PTY_LastName: 'srishanth', PTY_Phone: '+91 7801003403', PTY_SSN: '111-11-1111' },
  { PTY_ID: '02', PTY_FirstName: 'Mani', PTY_LastName: 'deep', PTY_Phone: '+91 9676282206', PTY_SSN: '222-22-2222' }
];

const states = [
  { Stt_ID: '01', Stt_Name: 'California', Stt_Code: 'CA' },
  { Stt_ID: '02', Stt_Name: 'Texas', Stt_Code: 'TX' }
];

const addresses = [
  { Add_ID: 'aaa1', Add_Line1: '123 Market St', Add_Line2: '', Add_City: 'Warangal', Add_State: 'TS', Add_Zip: '506002', Add_PartyID: '01' },
  { Add_ID: 'bbb1', Add_Line1: '400 Ranch Rd', Add_Line2: '', Add_City: 'Delhi galli', Add_State: 'DC', Add_Zip: '506003', Add_PartyID: '02' }
];

async function run() {
  if (!uri) {
    console.error('MONGODB_URI is not set. Check your .env or environment variables.');
    process.exit(1);
  }

  const client = new MongoClient(uri); // no deprecated options
  try {
    await client.connect();
    const db = client.db(dbName);

    for (const s of states) {
      await db.collection('SYS_State').updateOne({ Stt_ID: s.Stt_ID }, { $set: s }, { upsert: true });
    }
    for (const p of parties) {
      await db.collection('OPT_Party').updateOne({ PTY_ID: p.PTY_ID }, { $set: p }, { upsert: true });
    }
    for (const a of addresses) {
      await db.collection('OPT_Address').updateOne({ Add_ID: a.Add_ID }, { $set: a }, { upsert: true });
    }

    console.log('Seed complete');
  } catch (err) {
    console.error('Seed error', err);
  } finally {
    await client.close();
  }
}

run();