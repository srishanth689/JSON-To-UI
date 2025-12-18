import React, { useEffect, useState } from "react";
import "./ClientsDynamicTable.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

function ClientsDynamicTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disableInsert, setDisableInsert] = useState(true);
  const [searchId, setSearchId] = useState("");

  const fetchClients = async () => {
    try {
      console.log("📡 Fetching from:", `${API_URL}/clients`);
      const res = await fetch(`${API_URL}/clients`);
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error("❌ Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const insertClient = async () => {
    if (disableInsert) return;
    await fetch(`${API_URL}/clients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        party: {
          PTY_ID: "party11",
          PTY_FirstName: "New",
          PTY_LastName: "Client",
          PTY_Phone: "9999999999",
        },
        address: {
          Add_ID: "addr11",
          Add_PartyID: "party11",
          Add_Line1: "Street 11",
          Add_City: "Gurgaon",
          Add_State: "HR",
          Add_Zip: "122001",
        },
      }),
    });
    fetchClients();
  };

  if (loading) return <p>Loading...</p>;

  const rows = data.flatMap((item) => {
    if (!item.addresses || !Array.isArray(item.addresses)) return [];
    return item.addresses.map((addr) => ({
      clientId: item.client.PTY_ID || item.client.clientId || "—",
      name:
        item.client.PTY_Name ||
        `${item.client.PTY_FirstName || ""} ${item.client.PTY_LastName || ""}`.trim() ||
        item.client.name ||
        "—",
      phone: item.client.PTY_Phone || item.client.phone || "—",
      address:
        addr.address.Add_Line1 ||
        addr.address.Add_Street ||
        addr.address.street ||
        "—",
      city: addr.address.Add_City || addr.address.city || "—",
      zip: addr.address.Add_PostalCode || addr.address.Add_Zip || addr.address.zip || "—",
      state:
        (addr.state &&
          (addr.state.Stt_Name ||
            addr.state.State_Name ||
            addr.state.Stt_Code ||
            addr.state.code)) ||
        addr.address.Add_State ||
        "—",
    }));
  });

  const filteredRows = rows.filter((r) =>
    String(r.clientId || "").toLowerCase().includes(searchId.toLowerCase())
  );

  const cardStyle = {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: "16px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    textAlign: "center",
  };

  const cardTitle = { fontSize: "14px", color: "#777", marginBottom: "6px" };
  const cardValue = { fontSize: "26px", fontWeight: "bold", color: "#4CAF50" };

  return (
    <div
      style={{
        padding: 20,
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f7f9fc",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ color: "#333", marginBottom: 15 }}>
        Customers ({filteredRows.length} / {rows.length})
      </h2>

      <button
        onClick={insertClient}
        disabled={disableInsert}
        style={{
          backgroundColor: disableInsert ? "#a0a0a0" : "#4CAF50",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: 5,
          cursor: disableInsert || rows.length === 0 ? "not-allowed" : "pointer",
          transition: "background-color 0.3s",
          marginBottom: 20,
        }}
        onMouseEnter={(e) =>
          !disableInsert && (e.target.style.backgroundColor = "#45a049")
        }
        onMouseLeave={(e) =>
          !disableInsert && (e.target.style.backgroundColor = "#4CAF50")
        }
      >
        Insert Client (Disabled for Safety)
      </button>

      <input
        type="text"
        placeholder="Search by Client ID..."
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        style={{
          padding: "8px 12px",
          width: "250px",
          marginBottom: "15px",
          display: "block",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />

      <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
        <div style={cardStyle}>
          <div style={cardTitle}>Total Clients</div>
          <div style={cardValue}>{rows.length}</div>
        </div>
        <div style={cardStyle}>
          <div style={cardTitle}>Unique Cities</div>
          <div style={cardValue}>{[...new Set(rows.map((r) => r.city))].length}</div>
        </div>
        <div style={cardStyle}>
          <div style={cardTitle}>States Covered</div>
          <div style={cardValue}>{[...new Set(rows.map((r) => r.state))].length}</div>
        </div>
      </div>

      <table
        cellPadding="12"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#fff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#4CAF50", color: "white" }}>
            <th style={{ textAlign: "left", padding: "12px" }}>Client ID</th>
            <th style={{ textAlign: "left", padding: "12px" }}>Name</th>
            <th style={{ textAlign: "left", padding: "12px" }}>Phone</th>
            <th style={{ textAlign: "left", padding: "12px" }}>Address</th>
            <th style={{ textAlign: "left", padding: "12px" }}>City</th>
            <th style={{ textAlign: "left", padding: "12px" }}>State</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                No records found
              </td>
            </tr>
          )}
          {filteredRows.map((r, i) => (
            <tr
              key={i}
              style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "#f9f9f9" }}
            >
              <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                {r.clientId}
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                {r.name}
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                {r.phone}
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                {r.address}
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                {r.city}
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                {r.state}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClientsDynamicTable;