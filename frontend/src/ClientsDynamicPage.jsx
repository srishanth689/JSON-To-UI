import React, { useEffect, useState } from "react";

function ClientsDynamicPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:3000/clients");
      if (!res.ok) throw new Error("Failed to fetch clients");
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000); // polling every 5s
    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Clients ({data.length})</h1>
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Addresses</th>
          </tr>
        </thead>
        <tbody>
          {data.map((clientData) => {
            const client = clientData.client || {};
            const addresses = clientData.addresses || [];
            return (
              <tr key={client.PTY_ID}>
                <td>{client.PTY_FirstName} {client.PTY_LastName}</td>
                <td>{client.PTY_Phone}</td>
                <td>
                  {addresses.map((addr) => {
                    const state = addr.state || {};
                    // Handle both naming conventions
                    const stateName = state.Stt_Name || state.State_Name || "N/A";
                    const stateID = state.Stt_ID || state.State_ID || "N/A";

                    return (
                      <div key={addr.address.Add_ID} style={{ marginBottom: "10px" }}>
                        {addr.address.Add_Line1}, {addr.address.Add_Line2}
                        <br />
                        {addr.address.Add_City} — {addr.address.Add_State} — {addr.address.Add_Zip}
                        <br />
                        <span>State: {stateName} ({stateID})</span>
                        <hr />
                      </div>
                    );
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ClientsDynamicPage;