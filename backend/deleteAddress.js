const fs = require('fs');
const path = require('path');

// JSON file path
const addressesPath = path.join(__dirname, 'data', 'OPT_Address.json');

// Load JSON file
let addresses = require(addressesPath);

// Record to delete
const partyId = "101";    // PTY_ID of the client
const addressId = "3";    // Add_ID of the address

// Filter out the record
addresses = addresses.filter(a => !(a.Add_PartyID === partyId && a.Add_ID === addressId));

// Save back to JSON file
fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));

console.log(`Deleted Address: Add_ID=${addressId} for PartyID=${partyId}`);
