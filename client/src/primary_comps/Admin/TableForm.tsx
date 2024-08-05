import React, { useState, useEffect } from 'react';

interface TableFormProps {
  tableId?: string;
  onTableSaved: () => void;
}

const TableForm: React.FC<TableFormProps> = ({ tableId, onTableSaved }) => {
  const [tableNumber, setTableNumber] = useState<number | ''>('');
  const [capacity, setCapacity] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tableId) {
      // Fetch existing table data if tableId is provided
      fetch(`http://localhost:3001/api/admin/tables/${tableId}`)
        .then(response => response.json())
        .then(table => {
          setTableNumber(table.tableNumber);
          setCapacity(table.capacity);
        })
        .catch(err => {
          console.error('Error fetching table:', err);
          setError('Failed to fetch table data.');
        });
    }
  }, [tableId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (tableNumber === '' || capacity === '') {
      setError('Table number and capacity are required.');
      return;
    }

    const tableData = { tableNumber, capacity };

    try {
      const method = tableId ? 'PUT' : 'POST';
      const url = tableId ? `http://localhost:3001/api/admin/tables/${tableId}` : 'http://localhost:3001/api/admin/tables';
      
      console.log('Submitting table data:', tableData); // Log the data being submitted

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tableData)
      });

      if (!response.ok) {
        // Extract error message from the response
        const errorData = await response.json();
        console.error('Server responded with an error:', errorData); // Log server error
        throw new Error(errorData.error || 'Network response was not ok');
      }

      onTableSaved();
    } catch (error) {
      console.error('Error saving table:', error);
      setError('Failed to save table.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="tableNumber">Table Number:</label>
          <input
            id="tableNumber"
            type="number"
            value={tableNumber}
            onChange={(e) => setTableNumber(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label htmlFor="capacity">Capacity:</label>
          <input
            id="capacity"
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            required
          />
        </div>
        <button type="submit">Save Table</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default TableForm;
