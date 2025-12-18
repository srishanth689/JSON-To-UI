import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

export default function ClientsAndRows() {
  const [clients, setClients] = useState([]);
  const [rows, setRows] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingRows, setLoadingRows] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let aborted = false;

    const loadClients = async () => {
      try {
        const res = await fetch(`${API_URL}/clients`);
        if (!res.ok) throw new Error("Failed to fetch clients");
        const data = await res.json();
        if (!aborted) setClients(data);
      } catch (e) {
        if (!aborted) setError(e.message);
      } finally {
        if (!aborted) setLoadingClients(false);
      }
    };

    const loadRows = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/rows`);
        if (!aborted) setRows(res.data || []);
      } catch (e) {
        if (!aborted) console.warn("Could not load /api/rows:", e.message);
      } finally {
        if (!aborted) setLoadingRows(false);
      }
    };

    loadClients();
    loadRows();
    return () => {
      aborted = true;
    };
  }, []);

  if (loadingClients) return <p>Loading clients...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: 16 }}>
      <h3>ClientsAndRows</h3>
      <pre>{JSON.stringify({ clients, rows }, null, 2)}</pre>
    </div>
  );
}