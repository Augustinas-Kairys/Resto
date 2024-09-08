import  { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import Notification from '../Utils/Notification'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Logo from '../Assets/restobg.png'

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'danger' | 'info' } | null>(null); 
  const navigate = useNavigate();

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const responseData = await response.json();
        const { token, userId } = responseData; 
        sessionStorage.setItem('token', token); 
        sessionStorage.setItem('userId', userId);
        console.log("Login successful");
        navigate('/');
        window.location.reload();
      } else {
        const errorData = await response.json();
        setNotification({ message: errorData.message, type: 'danger' });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setNotification({ message: "Error logging in. Please try again later.", type: 'danger' });
    }
  };

  return (
    <div className="d-flex align-items-center vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card">
              <div className="card-body">
              <div className="logo text-center">
                <img src={Logo} alt="Logo" className="logo-img img-fluid w-25" />
                </div>
                <h3 className="card-title text-center">Login</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className="form-control"
                      id="floatingEmail"
                      placeholder="Email"
                      value={email}
                      onChange={handleEmailChange}
                      required
                    />
                    <label htmlFor="floatingEmail">Email</label>
                    <FontAwesomeIcon icon={faEnvelope} className="form-control-icon" />
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="password"
                      className="form-control"
                      id="floatingPassword"
                      placeholder="Password"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                    />
                    <label htmlFor="floatingPassword">Password</label>
                    <FontAwesomeIcon icon={faLock} className="form-control-icon" />
                  </div>

                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary">Login</button>
                  </div>
                  <div className="text-center mt-3">
                    <Link to="/Forgot-Password">Forgot Password?</Link>
                  </div>
                </form>
                {notification && <Notification message={notification.message} type={notification.type} id={0} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
