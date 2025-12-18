// backend/getClients.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'appdb';

async function run() {
  if (!uri) {
    console.error('MONGODB_URI is not set. Check your .env or environment variables.');
    process.exit(1);
  }

  const client = new MongoClient(uri); // no deprecated options
  try {
    await client.connect();
    const db = client.db(dbName);

    const pipeline = [
      {
        $lookup: {
          from: 'OPT_Address',
          let: { partyId: '$PTY_ID' },
          pipeline: [
            { $match: { $expr: { $eq: ['$Add_PartyID', '$$partyId'] } } },
            {
              $lookup: {
                from: 'SYS_State',
                localField: 'Add_State',
                foreignField: 'Stt_ID',
                as: 'state'
              }
            },
            { $unwind: { path: '$state', preserveNullAndEmptyArrays: true } },
            {
              $project: {
                _id: 0,
                address: {
                  Add_ID: '$Add_ID',
                  Add_Line1: '$Add_Line1',
                  Add_Line2: '$Add_Line2',
                  Add_City: '$Add_City',
                  Add_State: '$Add_State',
                  Add_Zip: '$Add_Zip',
                  Add_PartyID: '$Add_PartyID'
                },
                state: {
                  Stt_ID: '$state.Stt_ID',
                  Stt_Name: '$state.Stt_Name',
                  Stt_Code: '$state.Stt_Code'
                }
              }
            }
          ],
          as: 'addresses'
        }
      },
      {
        $project: {
          _id: 0,
          client: {
            PTY_ID: '$PTY_ID',
            PTY_FirstName: '$PTY_FirstName',
            PTY_LastName: '$PTY_LastName',
            PTY_Phone: '$PTY_Phone'
          },
          addresses: '$addresses'
        }
      }
    ];

    const result = await db.collection('OPT_Party').aggregate(pipeline).toArray();
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Error', err);
  } finally {
    await client.close();
  }
}

run();