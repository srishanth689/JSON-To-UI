import React, { useState, useEffect } from "react";

/**
 * DynamicForm
 * - schemaKeys: array of field keys to show (order)
 * - initial: object with initial values
 * - onSubmit(updatedObject) called when Save clicked
 */
export default function DynamicForm({ schemaKeys, initial = {}, onSubmit, title = "Edit" }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    // initialize form with initial values (ensure all keys exist)
    const obj = {};
    schemaKeys.forEach(k => obj[k] = initial[k] ?? "");
    setForm(obj);
  }, [schemaKeys, initial]);

  const handleChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit(form);
  };

  return (
    <div style={{ marginTop: 12 }}>
      <h3>{title}</h3>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8 }}>
        {schemaKeys.map(k => (
          <label key={k} style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 13, color: "#333", marginBottom: 4 }}>{k}</span>
            <input
              value={form[k] ?? ""}
              onChange={(e) => handleChange(k, e.target.value)}
              style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            />
          </label>
        ))}

        <div>
          <button type="submit" style={{ padding: "8px 12px" }}>Save</button>
        </div>
      </form>
    </div>
  );
}
