import  { useState, useEffect } from 'react';
import Notification from '../Utils/Notification'; // Import Notification component

interface TableFormProps {
  tableId?: string;
  onTableSaved: () => void;
}

const TableForm: React.FC<TableFormProps> = ({ tableId, onTableSaved }) => {
  const [tableNumber, setTableNumber] = useState<number | ''>('');
  const [capacity, setCapacity] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'danger' | 'info' } | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // New state for admin check

  useEffect(() => {
    const fetchUserData = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setError('Unauthorized');
        return;
      }

      try {
        const response = await fetch('http://localhost:3001/api/auth/user-info', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.role !== 'admin') {
            setError('You do not have permission to access this page.');
            setIsAdmin(false);
          } else {
            setIsAdmin(true);
          }
        } else {
          setError('Failed to fetch user data.');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('An error occurred.');
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (tableNumber === '' || capacity === '') {
      setNotification({ message: 'Table number and capacity are required.', type: 'danger' });
      return;
    }

    if (!isAdmin) {
      setNotification({ message: 'You do not have permission to create or edit tables.', type: 'danger' });
      return;
    }

    const tableData = { tableNumber, capacity };

    try {
      const method = tableId ? 'PUT' : 'POST';
      const url = tableId ? `http://localhost:3001/api/admin/tables/${tableId}` : 'http://localhost:3001/api/admin/tables';
      
      console.log('Submitting table data:', tableData); 
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tableData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server responded with an error:', errorData);
        setNotification({ message: errorData.error || 'Network response was not ok', type: 'danger' });
        return;
      }

      setNotification({ message: 'Table saved successfully.', type: 'success' });
      onTableSaved();
    } catch (error) {
      console.error('Error saving table:', error);
      setNotification({ message: 'Failed to save table.', type: 'danger' });
    }
  };

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  if (isAdmin === false) {
    return <p className="text-danger">Access denied. You are not an admin.</p>;
  }

  return (
    <div className="container mt-5">
      <h2>{tableId ? 'Edit Table' : 'Create Table'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="tableNumber" className="form-label">Table Number</label>
          <input
            id="tableNumber"
            type="number"
            className="form-control"
            value={tableNumber}
            onChange={(e) => setTableNumber(Number(e.target.value))}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="capacity" className="form-label">Capacity</label>
          <input
            id="capacity"
            type="number"
            className="form-control"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Save Table</button>
      </form>
      {notification && <Notification message={notification.message} type={notification.type} id={0} />}
    </div>
  );
};

export default TableForm;
