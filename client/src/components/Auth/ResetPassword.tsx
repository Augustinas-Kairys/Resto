import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from '../Utils/Notification';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'danger' | 'info'; id: number } | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = queryParams.get('token');
    setToken(tokenFromUrl);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setNotification({ message: 'Passwords do not match', type: 'danger', id: 0 });
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/auth/reset-password', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, token }),
      });

      if (response.ok) {
        setNotification({ message: 'Password has been reset successfully!', type: 'success', id: 0 });
        setTimeout(() => {
          navigate('/login'); 
        }, 1000);
      } else {
        const result = await response.json();
        setNotification({ message: result.message || 'Failed to reset password', type: 'danger', id: 0 });
      }
    } catch (error) {
      console.error('Error:', error);
      setNotification({ message: 'An unexpected error occurred. Please try again later.', type: 'danger', id: 0 });
    }
  };

  return (
    <div className="d-flex align-items-center vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card shadow-sm">
              <div className="card-body">
                <h3 className="card-title text-center">Reset Password</h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">New Password</label>
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      className="form-control"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary">Reset Password</button>
                  </div>
                </form>
                {notification && (
                  <Notification message={notification.message} type={notification.type} id={notification.id} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
