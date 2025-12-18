// ClientsList.jsx
import React, { useEffect, useState } from "react";

export default function ClientsList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/clients")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setClients(data);
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading clients…</div>;
  if (err) return <div>Error: {err}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Clients ({clients.length})</h2>
      {clients.map((c) => (
        <div key={c.client.PTY_ID} style={{ border: "1px solid #ddd", margin: 12, padding: 12, borderRadius: 8 }}>
          <strong>{c.client.PTY_FirstName} {c.client.PTY_LastName}</strong> — {c.client.PTY_Phone}
          <div style={{ marginTop: 8 }}>
            <em>Addresses:</em>
            {c.addresses.length === 0 && <div>No addresses</div>}
            {c.addresses.map((a) => (
              <div key={a.address.Add_ID} style={{ marginTop: 8, paddingLeft: 8 }}>
                <div>{a.address.Add_Line1}{a.address.Add_Line2 ? `, ${a.address.Add_Line2}` : ""}</div>
                <div>{a.address.Add_City} — {a.address.Add_State} — {a.address.Add_Zip}</div>
                <div>
                  <strong>State:</strong>{" "}
                  {a.state ? `${a.state.State_Name || a.state.Stt_Name || a.state.Stt_Name} (${a.state.State_ID || a.state.Stt_ID || a.state.Stt_Code || "N/A"})`
                         : "Not available"}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
