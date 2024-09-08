import  { useState } from 'react';
import Notification from '../Utils/Notification';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'danger' | 'info'; id: number } | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/auth/forgot-password', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setNotification({ message: 'Password reset email sent successfully!', type: 'success', id: 0 });
      } else {
        const result = await response.json();
        setNotification({ message: result.message || 'Failed to send password reset email', type: 'danger', id: 0 });
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
                <h3 className="card-title text-center">Forgot Password</h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary">Send Reset Link</button>
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

export default ForgotPassword;