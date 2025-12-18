// scripts/insertMongoSeed.js
const mongoose = require('mongoose');

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/db2json_project';

const partySchema = new mongoose.Schema({
  PTY_FirstName: String,
  PTY_LastName: String,
  PTY_Phone: String,
  PTY_SSN: String
});
const stateSchema = new mongoose.Schema({
  Stt_Name: String,
  Stt_Code: String
});
const addressSchema = new mongoose.Schema({
  Add_Line1: String,
  Add_Line2: String,
  Add_City: String,
  Add_State: { type: mongoose.Schema.Types.ObjectId, ref: 'SYS_State' },
  Add_Zip: String,
  Add_PartyID: { type: mongoose.Schema.Types.ObjectId, ref: 'OPT_Party' }
});

const Party = mongoose.model('OPT_Party', partySchema);
const State = mongoose.model('SYS_State', stateSchema);
const Address = mongoose.model('OPT_Address', addressSchema);

async function run(){
  await mongoose.connect(MONGO);
  console.log('Connected to', MONGO);

  // insert states
  const existingStates = await State.find({});
  if (existingStates.length === 0) {
    await State.insertMany([
      { Stt_Name: 'Telangana', Stt_Code: 'TG' },
      { Stt_Name: 'Andhra Pradesh', Stt_Code: 'AP' },
      { Stt_Name: 'Karnataka', Stt_Code: 'KA' }
    ]);
    console.log('Inserted states');
  } else {
    console.log('States already present, count =', existingStates.length);
  }

  // insert parties
  const parties = await Party.insertMany([
    { PTY_FirstName: 'Liam', PTY_LastName: 'Johnson', PTY_Phone: '9000000001', PTY_SSN: 'SSN001' },
    { PTY_FirstName: 'Olivia', PTY_LastName: 'Brown', PTY_Phone: '9000000002', PTY_SSN: 'SSN002' },
    { PTY_FirstName: 'Noah', PTY_LastName: 'Smith', PTY_Phone: '9000000003', PTY_SSN: 'SSN003' }
  ]);
  console.log('Inserted parties:', parties.map(p=>p.PTY_FirstName).join(', '));

  // find state & party ids
  const tg = await State.findOne({ Stt_Code: 'TG' });
  const ap = await State.findOne({ Stt_Code: 'AP' });
  const liam = await Party.findOne({ PTY_FirstName: 'Liam' });
  const olivia = await Party.findOne({ PTY_FirstName: 'Olivia' });
  const noah = await Party.findOne({ PTY_FirstName: 'Noah' });

  // insert addresses
  const addrCount = await Address.countDocuments();
  if (addrCount === 0) {
    await Address.insertMany([
      { Add_Line1: '1 MG Road', Add_Line2: 'Near Central Park', Add_City: 'Hyderabad', Add_State: tg._id, Add_Zip: '500001', Add_PartyID: liam._id },
      { Add_Line1: '10 Banjara Hills', Add_Line2: 'Apt 5B', Add_City: 'Hyderabad', Add_State: tg._id, Add_Zip: '500034', Add_PartyID: olivia._id },
      { Add_Line1: '25 Beach Road', Add_Line2: 'Block C', Add_City: 'Vishakhapatnam', Add_State: ap._id, Add_Zip: '530001', Add_PartyID: noah._id }
    ]);
    console.log('Inserted addresses');
  } else {
    console.log('Addresses already exist, count =', addrCount);
  }

  await mongoose.disconnect();
  console.log('Done');
}

run().catch(err => { console.error(err); process.exit(1); });
