import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/auth';
import './Login.css'; // Import the CSS file
import logo from '../../assets/bbl.png';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false); // State to handle error
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const location = useLocation();

  //form function
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/v1/auth/login`, { email, password });
      if (res.data.success) {
        setError(false); // Reset error state on successful login
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem('auth', JSON.stringify(res.data));
        navigate(location.state || '/');
        toast.success(res.data.message);
      } else {
        setError(true); // Set error state on unsuccessful login
        toast.error("Either email or password is incorrect"); // Updated error message
      }
    } catch (error) {
      console.log(error);
      setError(true); // Set error state on error
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <div className='insidelogin'>
      <div className="imgdescall">
      <img src={logo} width="200px" height="280px"  className="logoimg" alt="Logo"/>
      <h2>Login</h2>
        <h3>Become a member of Bello Today!</h3>
        <p>Get exclusive discounts by becoming a member today!</p>
      </div>
      <div className="loginpage">
        <form onSubmit={handleLogin} className="loginform">
          <div className="fgg">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`fcc`} // Apply error class if error state is true
              placeholder="Enter Your Email"
              required
            />
          </div>

          <div className="fgg">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`fcc ${error ? 'error' : ''}`} // Apply error class if error state is true
              placeholder="Enter Your Password"
              required
            />
          </div>
          {error && <p className="error-message">Password is incorrect</p>} {/* Conditional rendering of error message */}
          <button type="submit" className="loginbtn">
            Login
          </button>
          <div className="mt-3">
            <button
              type="button"
              className="loginbtn"
              onClick={() => { navigate('/forgot-password') }}
            >
              Forgot Password
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default Login;

