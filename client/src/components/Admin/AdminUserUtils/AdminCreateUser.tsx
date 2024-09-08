import { useState } from 'react';
import Notification from '../../Utils/Notification'; 

const AdminCreateUser: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<string>('user'); // Added role state
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'danger' | 'info' } | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const token = sessionStorage.getItem('token'); 
      if (!token) {
        setNotification({ message: 'User not authenticated', type: 'danger' });
        return;
      }

      const response = await fetch('http://localhost:3001/api/auth/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify({ username, email, role }), 
      });

      if (response.ok) {
        const responseData = await response.json();
        setNotification({ message: 'User created successfully', type: 'success' });
        setTempPassword(responseData.tempPassword); 
      } else {
        const errorData = await response.json();
        setNotification({ message: errorData.message || 'Error creating user', type: 'danger' });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setNotification({ message: 'Error creating user. Please try again later.', type: 'danger' });
    }
  };

  return (
    <div className="container mt-5">
      <h2>Admin Create User</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="floatingUsername"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
          <label htmlFor="floatingUsername">Username</label>
        </div>

        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            id="floatingEmail"
            placeholder="name@example.com"
            value={email}
            onChange={handleEmailChange}
            required
          />
          <label htmlFor="floatingEmail">Email address</label>
        </div>

        <div className="form-floating mb-3">
          <select
            className="form-select"
            id="floatingRole"
            value={role}
            onChange={handleRoleChange}
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <label htmlFor="floatingRole">Role</label>
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
