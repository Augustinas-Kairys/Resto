import React from 'react';
import { useParams } from 'react-router-dom';
import TableForm from './TableForm';

const TablePage: React.FC = () => {
  const { tableId } = useParams<{ tableId?: string }>();

  const handleTableSaved = () => {
  };

  return (
    <div>
      <h2>{tableId ? 'Edit Table' : 'Create Table'}</h2>
      <TableForm tableId={tableId} onTableSaved={handleTableSaved} />
    </div>
  );
};

export default TablePage;
