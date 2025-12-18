require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 MongoDB CONNECT
const mongoUri = process.env.MONGODB_URI || "";
const mongoDbName = process.env.DB_NAME || "appdb";
let isMongoConnected = false;

mongoose
  .connect(mongoUri, { dbName: mongoDbName, family: 4 })
  .then(() => {
    console.log(`MongoDB connected to ${mongoDbName}`);
    isMongoConnected = true;
  })
  .catch((err) => {
    console.warn("MongoDB connection failed. Running in mock mode.");
    console.warn("Error:", err.message);
  });

// 🔹 SCHEMAS (EMPTY OK)
const partySchema = new mongoose.Schema({}, { strict: false });
const addressSchema = new mongoose.Schema({}, { strict: false });
const stateSchema = new mongoose.Schema({}, { strict: false });

// 🔹 MODELS (⚠️ THIRD PARAM = COLLECTION NAME)
// Align with Atlas collections: OPT_Party, OPT_Address, SYS_State
const Party = mongoose.model("Party", partySchema, "OPT_Party");
const Address = mongoose.model("Address", addressSchema, "OPT_Address");
const State = mongoose.model("State", stateSchema, "SYS_State");

// 🔹 MOCK DATA (for when MongoDB is not available)
const mockParties = [
  { PTY_ID: "1", PTY_Name: "ABC Corp", PTY_Email: "info@abc.com" },
  { PTY_ID: "2", PTY_Name: "XYZ Ltd", PTY_Email: "contact@xyz.com" }
];

const mockAddresses = [
  { Add_PartyID: "1", Add_Street: "123 Main St", Add_City: "New York", Add_State: "1" },
  { Add_PartyID: "2", Add_Street: "456 Oak Ave", Add_City: "Los Angeles", Add_State: "2" }
];

const mockStates = [
  { Stt_ID: "1", Stt_Name: "New York" },
  { Stt_ID: "2", Stt_Name: "California" }
];

// 🔹 TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend running OK");
});

// 🔹 DEBUG - Get raw data
app.get("/debug", async (req, res) => {
  try {
    const parties = await Party.find();
    const addresses = await Address.find();
    res.json({
      parties: parties,
      addresses: addresses,
      partiesCount: parties.length,
      addressesCount: addresses.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 SEED ENDPOINT - Insert sample data
app.post("/seed", async (req, res) => {
  try {
    if (!isMongoConnected) {
      return res.status(400).json({ error: "MongoDB not connected" });
    }

    // Sample data
    const sampleParties = [
      { PTY_ID: "1", PTY_Name: "TechCorp Solutions", PTY_Email: "contact@techcorp.com", PTY_Phone: "+1-555-0001" },
      { PTY_ID: "2", PTY_Name: "Global Enterprises", PTY_Email: "info@global.com", PTY_Phone: "+1-555-0002" },
      { PTY_ID: "3", PTY_Name: "Innovation Labs", PTY_Email: "hello@innovlabs.com", PTY_Phone: "+1-555-0003" }
    ];

    const sampleAddresses = [
      { Add_PartyID: "1", Add_Street: "123 Tech Avenue", Add_City: "San Francisco", Add_State: "CA", Add_PostalCode: "94102", Add_Country: "USA" },
      { Add_PartyID: "1", Add_Street: "456 Innovation Drive", Add_City: "New York", Add_State: "NY", Add_PostalCode: "10001", Add_Country: "USA" },
      { Add_PartyID: "2", Add_Street: "789 Business Plaza", Add_City: "Los Angeles", Add_State: "CA", Add_PostalCode: "90001", Add_Country: "USA" },
      { Add_PartyID: "3", Add_Street: "321 Creator Lane", Add_City: "Austin", Add_State: "TX", Add_PostalCode: "78701", Add_Country: "USA" }
    ];

    // Clear existing data
    await Party.deleteMany({});
    await Address.deleteMany({});

    // Insert sample data
    await Party.insertMany(sampleParties);
    await Address.insertMany(sampleAddresses);

    res.json({ 
      message: "✅ Database seeded successfully", 
      partiesInserted: sampleParties.length,
      addressesInserted: sampleAddresses.length
    });
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    res.status(500).json({ error: "Failed to seed database", details: err.message });
  }
});

// 🔹 MAIN API
app.get("/clients", async (req, res) => {
  try {
    let parties = mockParties;
    let addresses = mockAddresses;
    let states = mockStates;

    if (isMongoConnected) {
      parties = await Party.find().lean();
      addresses = await Address.find().lean();
      states = await State.find().lean();
      console.log(
        "✅ Fetched from MongoDB - Parties:",
        parties.length,
        "Addresses:",
        addresses.length,
        "States:",
        states.length
      );
    } else {
      console.log("⚠️ Using mock data");
    }

    const result = parties.map((p) => {
      const clientAddresses = addresses
        .filter((a) => String(a.Add_PartyID) === String(p.PTY_ID))
        .map((a) => ({
          address: a,
          state: states.find((s) => String(s.Stt_ID) === String(a.Add_State)) || null,
        }));

      return {
        client: p,
        addresses: clientAddresses,
      };
    });

    res.json(result);
  } catch (err) {
    console.error("❌ Error fetching clients:", err.message);
    res.status(500).json({ error: "Failed to fetch clients" });
  }
});
app.post("/clients", async (req, res) => {
  try {
    // Support two payload shapes:
    // 1) { party: {...}, address: {...} }
    // 2) { client: {...}, addresses: [{ address: {...}, state: null }] }
    const { party, address, client, addresses } = req.body || {};

    if (client && Array.isArray(addresses)) {
      // Handle bundled shape by aligning IDs and inserting
      const primaryAddr = (addresses[0] && addresses[0].address) ? { ...addresses[0].address } : {};
      if (!client.PTY_ID) {
        return res.status(400).json({ error: "Missing client.PTY_ID" });
      }
      primaryAddr.Add_PartyID = client.PTY_ID;
      primaryAddr.Add_ID = client.PTY_ID;

      if (!isMongoConnected) {
        return res.status(503).json({ error: "Database not connected" });
      }

      const createdParty = await Party.create(client);
      const createdAddress = await Address.create(primaryAddr);

      return res.status(201).json({
        message: "Created",
        data: {
          client: createdParty.toObject ? createdParty.toObject() : createdParty,
          addresses: [
            {
              address: createdAddress.toObject ? createdAddress.toObject() : createdAddress,
              state: null,
            },
          ],
        },
      });
    }

    // Legacy simple shape
    if (!party || !party.PTY_ID) {
      return res.status(400).json({ error: "Missing party.PTY_ID" });
    }

    const alignedAddress = { ...(address || {}) };
    alignedAddress.Add_PartyID = party.PTY_ID;
    alignedAddress.Add_ID = party.PTY_ID;

    if (isMongoConnected) {
      const newParty = await Party.create(party);
      const newAddress = await Address.create(alignedAddress);
      res.json({ message: "Inserted successfully", party: newParty, address: newAddress });
    } else {
      res.json({ 
        message: "Mock mode: Data would be saved (MongoDB not connected)", 
        party, 
        address: alignedAddress 
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 Accept bundled client payload in the same shape as GET response
// {
//   client: { PTY_ID, PTY_FirstName, PTY_LastName, PTY_Phone, ... },
//   addresses: [{ address: { Add_ID, Add_Line1, Add_PartyID, Add_State, Add_Zip, ... }, state: null }]
// }
app.post("/clients/bundle", async (req, res) => {
  try {
    const { client, addresses } = req.body || {};

    if (!client || !Array.isArray(addresses) || addresses.length === 0) {
      return res.status(400).json({ error: "Invalid payload: requires { client, addresses[0].address }" });
    }

    const primaryAddr = addresses[0]?.address || {};

    if (!client.PTY_ID) {
      return res.status(400).json({ error: "Missing client.PTY_ID" });
    }
    // Enforce ID alignment unconditionally
    primaryAddr.Add_PartyID = client.PTY_ID;
    primaryAddr.Add_ID = client.PTY_ID;

    if (!isMongoConnected) {
      return res.status(503).json({ error: "Database not connected" });
    }

    // Insert into Atlas collections (schemas are loose with strict:false)
    const createdParty = await Party.create(client);
    const createdAddress = await Address.create(primaryAddr);

    // Build response in the same shape frontend expects
    const result = {
      client: createdParty.toObject ? createdParty.toObject() : createdParty,
      addresses: [
        {
          address: createdAddress.toObject ? createdAddress.toObject() : createdAddress,
          state: null,
        },
      ],
    };

    return res.status(201).json({ message: "Created", data: result });
  } catch (err) {
    console.error("/clients/bundle error:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
});

// 🔹 Admin: unset fields via POST body
// Payload: { collection: "OPT_Party", filter: {...}, unset: { PTY_SSN: "" } }
app.post("/admin/unset", async (req, res) => {
  try {
    const { collection, filter = {}, unset = {} } = req.body || {};

    if (!isMongoConnected) {
      return res.status(503).json({ error: "Database not connected" });
    }
    if (!collection || Object.keys(unset).length === 0) {
      return res.status(400).json({ error: "Requires collection and unset payload" });
    }

    const col = mongoose.connection.db.collection(collection);
    const result = await col.updateMany(filter, { $unset: unset });
    return res.json({ message: "Unset applied", matched: result.matchedCount, modified: result.modifiedCount });
  } catch (err) {
    console.error("/admin/unset error:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
});

// 🔹 Admin: delete documents via filter
// Payload: { collection: "OPT_Party", filter: { PTY_FirstName: "Olivia" } }
app.post("/admin/delete", async (req, res) => {
  try {
    const { collection, filter = {} } = req.body || {};

    if (!isMongoConnected) {
      return res.status(503).json({ error: "Database not connected" });
    }
    if (!collection) {
      return res.status(400).json({ error: "Requires collection" });
    }

    const col = mongoose.connection.db.collection(collection);
    const result = await col.deleteMany(filter);
    return res.json({ message: "Delete applied", deleted: result.deletedCount });
  } catch (err) {
    console.error("/admin/delete error:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
});

// 🔹 DELETE client (and addresses) or a single address
// DELETE /clients/:ptyId           -> deletes client + all addresses
// DELETE /clients/:ptyId?addressId=ADDR -> deletes only that address for the client
app.delete("/clients/:ptyId", async (req, res) => {
  try {
    const { ptyId } = req.params;
    const { addressId } = req.query;

    if (!isMongoConnected) {
      return res.status(503).json({ error: "Database not connected" });
    }

    if (!ptyId) {
      return res.status(400).json({ error: "Missing PTY_ID" });
    }

    if (addressId) {
      // Delete only one address
      const addrResult = await Address.deleteOne({ Add_PartyID: ptyId, Add_ID: addressId });
      return res.json({
        message: "Address deleted",
        deletedCount: addrResult.deletedCount,
        scope: { ptyId, addressId },
      });
    }

    // Delete client and all addresses
    const partyResult = await Party.deleteOne({ PTY_ID: ptyId });
    const addrResult = await Address.deleteMany({ Add_PartyID: ptyId });

    return res.json({
      message: "Client deleted",
      deletedPartyCount: partyResult.deletedCount,
      deletedAddressCount: addrResult.deletedCount,
      scope: { ptyId },
    });
  } catch (err) {
    console.error("DELETE /clients/:ptyId error:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
});

app.post("/admin/set", async (req, res) => {
  const { collection, filter = {}, set = {}, options = {} } = req.body || {};
  if (!collection) return res.status(400).json({ error: "Missing collection" });
  if (!set || Object.keys(set).length === 0) return res.status(400).json({ error: "Missing set object" });
  if (!isMongoConnected) return res.status(503).json({ error: "Database not connected" });

  try {
    const col = mongoose.connection.db.collection(collection);
    const result = await col.updateMany(filter, { $set: set }, options);
    return res.json({
      message: "Set applied",
      matched: result.matchedCount,
      modified: result.modifiedCount,
      upsertedId: result.upsertedId ?? null,
    });
  } catch (err) {
    console.error("admin/set error", err);
    return res.status(500).json({ error: "Failed to apply set" });
  }
});

// 🔹 SERVER START
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
