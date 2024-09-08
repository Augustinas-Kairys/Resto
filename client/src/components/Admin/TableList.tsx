import  { useState, useEffect } from 'react';
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
    <div className="container mt-5">
      <h2 className="mb-4">Table List</h2>
      <div className="mb-3">
        <Link to="/create-table" className="btn btn-primary">Create New Table</Link>
      </div>
      <div className="list-group">
        {tables.map(table => (
          <div key={table._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">Table Number: {table.tableNumber}</h5>
              <p className="mb-1">Capacity: {table.capacity}</p>
            </div>
            <div>
              <Link to={`/edit-table/${table._id}`} className="btn btn-secondary btn-sm me-2">Edit</Link>
              <button 
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(table._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableList;
