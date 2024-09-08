import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: 'user' | 'admin';
}

const EditUserFormComponent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          setNotification({ message: 'User not authenticated', type: 'danger' });
          return;
        }

        const response = await fetch(`http://localhost:3001/api/auth/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data: User = await response.json();
          setUser(data);
          setUsername(data.username);
          setEmail(data.email);
          setFirstName(data.firstName);
          setLastName(data.lastName);
          setPhoneNumber(data.phoneNumber);
          setRole(data.role);
        } else {
          throw new Error('Failed to fetch user');
        }
      } catch (err) {
        setNotification({ message: (err as Error).message, type: 'danger' });
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setNotification({ message: 'User not authenticated', type: 'danger' });
        return;
      }
  
      const response = await fetch(`http://localhost:3001/api/auth/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ username, email, firstName, lastName, phoneNumber, role }),
      });
  
      if (response.ok) {
        setNotification({ message: 'User updated successfully', type: 'success' });
        navigate('/Admin/Users');
      } else {
        const errorData = await response.json();
        setNotification({ message: errorData.message || 'Error updating user', type: 'danger' });
      }
    } catch (error) {
      setNotification({ message: 'Error updating user. Please try again later.', type: 'danger' });
    }
  };

  return (
    <div className="modal show d-block" role="dialog">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit User</h5>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  className="form-control"
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">Update User</button>
              <button type="button" className="btn btn-secondary ml-2" onClick={() => navigate('/Admin/Users')}>Close</button>
            </form>
            {notification && (
              <div className={`alert alert-${notification.type} mt-3`} role="alert">
                {notification.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserFormComponent;
