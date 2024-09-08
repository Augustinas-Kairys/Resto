import React from 'react';
import { Link } from 'react-router-dom';

const Admin: React.FC = () => {
  return (
    <div className="container mt-5">
      <h1 className="mb-4">Admin Menu Management</h1>
      <div className="list-group">
        <Link to="/AdminMenuEdit" className="list-group-item list-group-item-action">
          Create New Menu Items
        </Link>
        <Link to="/Tables" className="list-group-item list-group-item-action">
          Create New Tables
        </Link>
        <Link to="/Admin/Create-User" className="list-group-item list-group-item-action">
          Create a User
        </Link>
        <Link to="/Admin/Users" className="list-group-item list-group-item-action">
          User Management
        </Link>
      </div>
    </div>
  );
};

export default Admin;
