# JSON-To-UI
## Dynamic JSON-to-UI Rendering with Full CRUD Operations

📌 Project Overview

- JSON-To-UI is a comprehensive full-stack data management system that converts JSON data into interactive UI components. It provides seamless CRUD (Create, Read, Update, Delete) operations with a responsive grid-based interface, enabling users to manage clients and their addresses efficiently.

Key Capability

- Transform raw JSON data into beautifully formatted UI tables with real-time synchronization between frontend and MongoDB backend.

✨ Objectives & Features

- JSON to UI Conversion - Convert JSON data into responsive grid format
- Real-Time CRUD Operations - Seamless Create, Read, Update, Delete functionality
- Data Persistence - MongoDB integration for reliable data storage
- RESTful API Architecture - Standardized backend endpoints for all operations
- Production-Ready Deployment - Cloud deployment on Render (backend) & Vercel (frontend)

✅ Key Features

- GET Clients - Fetch all client records with addresses from MongoDB
- INSERT Clients - Add new clients with multiple addresses
- UPDATE Fields - Modify specific fields (cities, phone, addresses, etc.) using admin/set
- DELETE Fields - Remove specific columns/fields using admin/unset
- DELETE Clients - Remove entire client records
- Search & Filter - Search clients by ID with live filtering
- Analytics Dashboard - Display total clients, unique cities, and states covered
- Responsive Design - Mobile-friendly UI with modern styling


🛠️ Tech Stack Used

- Dynamic JSON-to-UI Rendering with Full CRUD Operations

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
- Node.js (v18.x or higher)
- npm (v9.x or higher – bundled with Node.js)
- Git
- Postman (for API testing)
- MongoDB Atlas account (Free Tier)
- Vercel account (Frontend deployment)
- Render account (Backend deployment)

🌐 Production URLs

Frontend (Vercel)
https://json-to-ui-4wq5hwk5j-srishanth689s-projects.vercel.app/

Backend (Render)
https://aspyr-backend.onrender.com

## Backend API

Base URL

https://aspyr-backend.onrender.com

- `GET /clients`(Retrieve all clients from database)
- `POST /clients`(Insert a record)
- `DELETE /clients/Target_Record`(Target_Record = clientID)
- `POST /admin/set`(Update one or many records at once)
- `POST /admin/unset`(Delete all records of a particular column)

## SAMPLE TEST CASES TO RUN

### 1) GET – Retrieve All Clients

- GET https://aspyr-backend.onrender.com/clients

Response
- All records from database are fetched in json format
- Status: 200 OK ✅

### 2) POST – Insert a record

- POST https://aspyr-backend.onrender.com/clients
- Content-Type: application/json
- Body -> raw -> json
```json
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
```
- Expected: 201 Created ✅

- Then refresh your Vercel URL → New "John Doe" row should appear in the table

### 3) UPDATE city using clientID

- POST https://aspyr-backend.onrender.com/admin/set
- Content-Type: application/json
- Body -> raw -> json
```json
{
  "collection": "OPT_Address",
  "filter": { "Add_PartyID": "TEST001" },
  "set": { "Add_City": "Pune" }
}
```
- Expected: Set applied ✅

- Refresh Vercel URL → City should change from "Mumbai" to "Pune"

### 4) DELETE client

- DELETE https://aspyr-backend.onrender.com/clients/TEST001

- Expected: Delete applied ✅

- Refresh Vercel URL → "John Doe" row should disappear

### 5) To delete all records of a particular column at once

- POST https://aspyr-backend.onrender.com/admin/unset
- Content-Type: application/json
- Body -> raw -> json
```json
{
  "collection": "OPT_Address",
  "filter": { },
  "unset": { " "Add_City": ""}
}
```
- Expected response:
```json
{
  "message": "Unset applied",
  "matched": 1,
  "modified": 1
}
```
- Then refresh Vercel URL → All fields for that address will show as "—"

### 6) UPDATE two or many things in one instance using clientID

- POST https://aspyr-backend.onrender.com/admin/set
- Content-Type: application/json
- Body -> raw -> json
```json
{
  "collection": "OPT_Address",
  "filter": { "Add_PartyID": {"$in": ["06","07"]} },
  "set": { "Add_State": "TS" }
}
```
- Expected: Set applied ✅

- Refresh Vercel URL → States of two records having ClientID 06 and 07 changes to TS"

## Common Field Names which can be used in CRUD operations

### Client (OPT_Party):

`OPT_Party` - Collection Name / Table Name

`PTY_ID` - Client ID

`PTY_FirstName` - First Name

`PTY_LastName` - Last Name

`PTY_Phone` - Phone Number

### Address (OPT_Address):

`OPT_Address` - Collection Name / Table Name

`Add_ID` - Address ID

`Add_PartyID` - Links to PTY_ID

`Add_Line1` - Street Address

`Add_City` - City

`Add_State` - State Code (e.g., "MH", "TS")












