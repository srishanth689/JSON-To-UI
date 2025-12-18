JSON-To-UI

Dynamic JSON-to-UI Rendering with Full CRUD Operations

📌 Project Overview

JSON-To-UI is a comprehensive full-stack data management system that converts JSON data into interactive UI components. It provides seamless CRUD (Create, Read, Update, Delete) operations with a responsive grid-based interface, enabling users to manage clients and their addresses efficiently.

Key Capability

Transform raw JSON data into beautifully formatted UI tables with real-time synchronization between frontend and MongoDB backend.

✨ Objectives & Features


Primary Objectives
JSON to UI Conversion - Convert JSON data into responsive grid format
Real-Time CRUD Operations - Seamless Create, Read, Update, Delete functionality
Data Persistence - MongoDB integration for reliable data storage
RESTful API Architecture - Standardized backend endpoints for all operations
Production-Ready Deployment - Cloud deployment on Render (backend) & Vercel (frontend)

✅ Key Features

✅ GET Clients - Fetch all client records with addresses from MongoDB
✅ INSERT Clients - Add new clients with multiple addresses
✅ UPDATE Fields - Modify specific fields (cities, phone, addresses, etc.) using admin/set
✅ DELETE Fields - Remove specific columns/fields using admin/unset
✅ DELETE Clients - Remove entire client records
✅ Search & Filter - Search clients by ID with live filtering
✅ Analytics Dashboard - Display total clients, unique cities, and states covered
✅ Responsive Design - Mobile-friendly UI with modern styling


🧩 System Architecture
Postman
   |
   |  REST API Requests
   v
Node.js + Express Backend
   |
   |  CRUD Operations
   v
MongoDB Atlas (Cloud)
   |
   |  JSON Response
   v
React Frontend (Grid-Based UI)


🛠️ Tech Stack Used

Dynamic JSON-to-UI Rendering with Full CRUD Operations

| Category            | Technology   | Version       |
| ------------------- | ------------ | ------------- |
| Frontend            | React.js     | 18.x          |
| Styling             | CSS3         | Modern        |
| Backend             | Node.js      | 18.x          |
| Framework           | Express.js   | 4.18.x        |
| Database            | MongoDB      | Cloud (Atlas) |
| ODM                 | Mongoose     | 7.6.x         |
| API Testing         | Postman      | Latest        |
| CORS                | cors         | 2.8.x         |
| Environment         | dotenv       | 16.x          |
| Frontend Deployment | Vercel       | —             |
| Backend Deployment  | Render       | —             |
| Version Control     | Git / GitHub | —             |



📋 Prerequisites

Before starting, ensure the following tools are installed:

Node.js (v18.x or higher)

npm (v9.x or higher – bundled with Node.js)

Git

Postman (for API testing)

MongoDB Atlas account (Free Tier)

GitHub account

Vercel account (Frontend deployment)

Render account (Backend deployment)

🌐 Production URLs

Frontend (Vercel)
https://json-to-ui-4wq5hwk5j-srishanth689s-projects.vercel.app/

Backend (Render)
https://aspyr-backend.onrender.com

📡 API Endpoints

Base URL

https://aspyr-backend.onrender.com

1️⃣ GET – Retrieve All Clients

GET https://aspyr-backend.onrender.com/clients

Response

Status: 200 OK

2️⃣ POST – Insert New Client

POST https://aspyr-backend.onrender.com/clients
Content-Type: application/json

{
  "client": {
    "PTY_ID": "TEST001",
    "PTY_FirstName": "John",
    "PTY_LastName": "Doe",
    "PTY_Phone": "+91 9876543210"
  },
  "addresses": [{
    "address": {
      "Add_ID": "TEST001",
      "Add_Line1": "123 Main Street",
      "Add_City": "Mumbai",
      "Add_State": "MH",
      "Add_Zip": "400001",
      "Add_PartyID": "TEST001"
    },
    "state": null
  }]
}

Expected: 201 Created ✅

Then refresh your Vercel URL → New "John Doe" row should appear in the table

Test 3: UPDATE city using clientID

POST https://aspyr-backend.onrender.com/admin/set
Content-Type: application/json

{
  "collection": "OPT_Address",
  "filter": { "Add_PartyID": "TEST001" },
  "set": { "Add_City": "Pune" }
}

Expected: Set applied ✅

Refresh Vercel URL → City should change from "Mumbai" to "Pune"

Test 4: DELETE client

DELETE https://aspyr-backend.onrender.com/clients/TEST001

Expected: Delete applied ✅

Refresh Vercel URL → "John Doe" row should disappear

Test 5: To delete all records of a particular column at once

POST https://aspyr-backend.onrender.com/admin/unset
Content-Type: application/json

{
  "collection": "OPT_Address",
  "filter": { },
  "unset": { " "Add_City": ""}
}

Expected response:

{
  "message": "Unset applied",
  "matched": 1,
  "modified": 1
}

Then refresh Vercel URL → All fields for that address will show as "—"

Common Field Names

Client (OPT_Party):

PTY_ID - Client ID

PTY_FirstName - First Name

PTY_LastName - Last Name

PTY_Phone - Phone Number

Address (OPT_Address):

Add_ID - Address ID

Add_PartyID - Links to PTY_ID

Add_Line1 - Street Address

Add_City - City

Add_State - State Code (e.g., "MH", "TS")

Add_Zip - Postal Code











