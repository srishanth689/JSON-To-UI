import React, { useState, useEffect } from 'react';
import './ClientsDynamicTable.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function ClientsDynamicTable() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      console.log('📡 Fetching from:', `${API_URL}/clients`);
      const response = await fetch(`${API_URL}/clients`);
      const json = await response.json();
      console.log('📡 API Response:', json);
      // ...existing code...
      setData(Array.isArray(json) ? json : []);
    } catch (error) {
      console.error('❌ Error fetching clients:', error);
    }
  };

  // ...rest of existing code stays the same...
}

export default ClientsDynamicTable;