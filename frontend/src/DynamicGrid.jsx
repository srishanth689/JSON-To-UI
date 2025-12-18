import React from "react";

/**
 * DynamicGrid
 * - schemaKeys: array of keys to show (order)
 * - rows: array of objects (each row is an object)
 * - onSelect(row) optional to edit/select
 */
export default function DynamicGrid({ schemaKeys, rows, title = "Items", onSelect }) {
  return (
    <div style={{ marginTop: 12 }}>
      <h3>{title} ({rows.length})</h3>
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              {schemaKeys.map(k => (
                <th key={k} style={{ border: "1px solid #ddd", padding: 8, textAlign: "left" }}>
                  {k}
                </th>
              ))}
              <th style={{ border: "1px solid #ddd", padding: 8 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={r[schemaKeys[0]] || idx}>
                {schemaKeys.map(k => (
                  <td key={k} style={{ border: "1px solid #eee", padding: 8 }}>
                    {String(r[k] ?? "")}
                  </td>
                ))}
                <td style={{ border: "1px solid #eee", padding: 8 }}>
                  {onSelect ? (
                    <button onClick={() => onSelect(r)}>Edit</button>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
