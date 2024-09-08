import { useEffect, useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
const Index: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = sessionStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:3001/api/auth/user-info', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
          if (data.role !== 'admin') {
          }
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch user data');
        }
      } catch (err) {
        setError('An error occurred while fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('token'); 
    navigate('/login'); 
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="d-flex justify-content-center align-items-center min-vh-100">
    <div className="alert alert-danger text-center w-50">
      <strong>Your session has expired.</strong> Please&nbsp;
      <Link to="/login" className="alert-link">relogin</Link> to continue.
    </div>
  </div>
  }
  
  return (
    <div>
      {userInfo?.role === 'admin' ? (
        <div className="d-flex justify-content-center align-items-center vh-60 bg-danger text-white">
          <p className="display-1">Admin Panel: You have admin privileges.</p>
        </div>
      ) : (
        <div className="d-flex justify-content-center align-items-center vh-60 bg-warning text-dark">
          <p className="display-1">You're a waiter.</p>
        </div>
      )}
  
      <div className="container mt-4 text-center">
        <h1 className="mb-3">Welcome, {userInfo?.username || 'User'}!</h1>
        <p className="lead">Email: {userInfo?.email || 'N/A'}</p>
        <p className="lead">First Name: {userInfo?.firstName || 'N/A'}</p>
        <h1 className="lead">Last Name: {userInfo?.lastName || 'User'}!</h1>
        <button onClick={handleLogout} className="btn btn-outline-danger mt-3">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Index;
