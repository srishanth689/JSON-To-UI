import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ClientsAndRows() {
  const [clients, setClients] = useState([]);
  const [rows, setRows] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingRows, setLoadingRows] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // fetch clients
    fetch("http://localhost:3000/clients")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch clients");
        return r.json();
      })
      .then((data) => setClients(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoadingClients(false));

    // fetch rows (your existing rows API)
    axios
      .get("http://localhost:3000/api/rows")
      .then((res) => setRows(res.data))
      .catch((e) => {
        // if API not present, keep rows empty but don't crash
        console.warn("Could not load /api/rows:", e.message);
      })
      .finally(() => setLoadingRows(false));
  }, []);

  const deleteRow = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/rows/${id}`);
      setRows((prev) => prev.filter((r) => r._id !== id));
    } catch (e) {
      alert("Delete failed: " + e.message);
    }
  };

  // Simple visual styles (you can replace with CSS later)
  const containerStyle = { padding: 20, fontFamily: "Arial, sans-serif" };
  const cardStyle = { border: "1px solid #ddd", padding: 12, borderRadius: 8, marginBottom: 12 };
  const smallGrey = { color: "#555", fontSize: 14 };

  return (
    <div style={containerStyle}>
      <h1>DB2JSON Project</h1>

      {/* CLIENTS SECTION */}
      <section style={{ marginBottom: 30 }}>
        <h2>Clients ({clients.length})</h2>

        {loadingClients ? <div>Loading clients…</div> : null}
        {error ? <div style={{ color: "red" }}>Error: {error}</div> : null}

        {clients.map((c) => (
          <div key={c.client.PTY_ID} style={cardStyle}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>
              {c.client.PTY_FirstName} {c.client.PTY_LastName} — <span style={smallGrey}>{c.client.PTY_Phone}</span>
            </div>

            <div style={{ marginTop: 8 }}>
              <div style={{ fontStyle: "italic", color: "#333" }}>Addresses:</div>
              {c.addresses.length === 0 && <div>No addresses</div>}
              {c.addresses.map((a) => (
                <div key={a.address.Add_ID} style={{ marginTop: 8, paddingLeft: 8 }}>
                  <div>
                    {a.address.Add_Line1}
                    {a.address.Add_Line2 ? `, ${a.address.Add_Line2}` : ""}
                  </div>
                  <div style={smallGrey}>
                    {a.address.Add_City} — {a.address.Add_State} — {a.address.Add_Zip}
                  </div>
                  <div style={{ marginTop: 4 }}>
                    <strong>State:</strong>{" "}
                    {a.state
                      ? `${a.state.State_Name || a.state.Stt_Name || a.state.name} (${a.state.State_ID || a.state.Stt_ID || a.state.Stt_Code || "N/A"})`
                      : "Not available"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ROWS TABLE SECTION */}
      <section>
        <h2>Rows</h2>
        {loadingRows ? <div>Loading rows…</div> : null}
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "left" }}>Name</th>
              <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "left" }}>Project</th>
              <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "left" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && !loadingRows && (
              <tr>
                <td colSpan={3} style={{ padding: 10, color: "#666" }}>
                  No rows found
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row._id}>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>{row.name}</td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>{row.project}</td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>
                  <button onClick={() => deleteRow(row._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
