import  { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; 
import Notification from '../Utils/Notification';
import './styles.scss'

const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [notifications, setNotifications] = useState<{ id: number, message: string, type: 'success' | 'danger' | 'info' }[]>([]);

  const query = new URLSearchParams(location.search);
  const token = query.get('token');

  useEffect(() => {
    if (!token) {
      setErrorMessage('Invalid or missing token');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return;

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      addNotification('Passwords do not match', 'danger');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/auth/registernew', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
          firstName,
          lastName,
          phoneNumber,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Registration completed successfully');
        addNotification('Registration completed successfully', 'success');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        const error = data.error || 'An error occurred';
        setErrorMessage(error);
        addNotification(error, 'danger');
      }
    } catch (error) {
      const errorMessage = 'An error occurred during registration';
      setErrorMessage(errorMessage);
      addNotification(errorMessage, 'danger');
    }
  };

  const addNotification = (message: string, type: 'success' | 'danger' | 'info') => {
    const id = notifications.length + 1;
    setNotifications([...notifications, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    }, 3000);
  };

  return (
    <div className="container mt-5">
      <h2>Complete Your Registration</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="floatingFirstName"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <label htmlFor="floatingFirstName">First Name</label>
        </div>

        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="floatingLastName"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <label htmlFor="floatingLastName">Last Name</label>
        </div>

        <div className="form-floating mb-3">
          <PhoneInput
            international
            defaultCountry="LT" 
            value={phoneNumber}
            onChange={setPhoneNumber}
            className="form-control"
            placeholder="Phone Number"
            required
          />
          <label htmlFor="floatingPhoneNumber">Phone Number</label>
        </div>

        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>

        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            id="floatingConfirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <label htmlFor="floatingConfirmPassword">Confirm Password</label>
        </div>

        <button type="submit" className="btn btn-primary">Complete Registration</button>
      </form>

      {notifications.map((notification) => (
        <Notification key={notification.id} id={notification.id} message={notification.message} type={notification.type} />
      ))}
    </div>
  );
};

export default Register;
