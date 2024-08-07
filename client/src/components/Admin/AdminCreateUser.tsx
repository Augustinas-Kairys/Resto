import React, { useState } from 'react';
import Notification from '../Utils/Notification';

const AdminCreateUser: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'danger' | 'info' } | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null); // State to hold temporary password

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/auth/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setNotification({ message: 'User created successfully', type: 'success' });
        setTempPassword(responseData.tempPassword); // Set the temporary password to state
      } else {
        const errorData = await response.json();
        setNotification({ message: errorData.message, type: 'danger' });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setNotification({ message: 'Error creating user. Please try again later.', type: 'danger' });
    }
  };

  return (
    <div className="container">
      <h2 className="mt-5">Admin Create User</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Create User</button>
      </form>
      {notification && <Notification message={notification.message} type={notification.type} id={0} />}
      {tempPassword && (
        <div className="alert alert-info mt-3" role="alert">
          Temporary Password: {tempPassword}
        </div>
      )}
    </div>
  );
};

export default AdminCreateUser;
