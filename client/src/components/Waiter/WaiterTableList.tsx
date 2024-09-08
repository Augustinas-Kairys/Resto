import  { useState, useEffect } from 'react';
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
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Waiter: Table List</h2>
      <ul className="list-group">
        {tables.map((table) => (
          <li key={table._id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              <strong>Table Number:</strong> {table.tableNumber}, <strong>Capacity:</strong> {table.capacity}
            </span>
            <Link to={`/create-order/${table._id}`} className="btn btn-primary">
              Create Order
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WaiterTableList;
