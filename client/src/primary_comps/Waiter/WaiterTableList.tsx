import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const WaiterTableList: React.FC = () => {
  const [tables, setTables] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/admin/tables')
      .then(response => response.json())
      .then(data => setTables(data))
      .catch(error => console.error('Error fetching tables:', error));
  }, []);

  return (
    <div>
      <h2>Waiter: Table List</h2>
      <ul>
        {tables.map(table => (
          <li key={table._id}>
            <span>Table Number: {table.tableNumber}, Capacity: {table.capacity}</span>
            <Link to={`/create-order/${table._id}`}>Create Order</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WaiterTableList;
