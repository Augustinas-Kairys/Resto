import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TableList: React.FC = () => {
  const [tables, setTables] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/admin/tables')
      .then(response => response.json())
      .then(data => setTables(data))
      .catch(error => console.error('Error fetching tables:', error));
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/admin/tables/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setTables(tables.filter(table => table._id !== id));
    } catch (error) {
      console.error('Error deleting table:', error);
    }
  };

  return (
    <div>
      <h2>Table List</h2>
      <ul>
        {tables.map(table => (
          <li key={table._id}>
            <span>Table Number: {table.tableNumber}, Capacity: {table.capacity}</span>
            <Link to={`/edit-table/${table._id}`}>Edit</Link>
            <button onClick={() => handleDelete(table._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <Link to="/create-table">Create New Table</Link>
    </div>
  );
};

export default TableList;
