import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import './Login.css';
import logo from '../../assets/bbl.png';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const [termsChecked, setTermsChecked] = useState(false);
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
  const navigate = useNavigate();

  const handleCheckboxChange = () => {
    setTermsChecked(!termsChecked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 5) {
      toast.error("Password must contain at least 5 characters");
      setIsPasswordInvalid(true);
      return;
    }
    setIsPasswordInvalid(false);

    if (!termsChecked) {
      toast.error("Check the TnC");
      return;
    }

    try {
      const res = await axios.post("/api/v1/auth/register", {
        name,
        email,
        password,
        phone,
        address,
        answer,
      });
      if (res && res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 409) {
        toast.error("Email is already taken");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="login-container">
      <Toaster />
      <div className="insidelogin">
        <div className="imgdescall">
        <img src={logo} width="200px" height="280px"  className="logoimg" alt="Logo"/>
          <h2>Register</h2>
          <h3>Become a member of Bello Today!</h3>
          <p>Get exclusive discounts by becoming a member today!</p>
        </div>
        <div className="loginpage">
          <form className="loginform" onSubmit={handleSubmit}>
            <div className="fgg">
              <div className="input-container">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="fcc"
                  required
                  autoFocus
                />
                <label className={`placeholder-label ${name && 'active'}`}>Enter Your Name</label>
              </div>
            </div>
            <div className="fgg">
              <div className="input-container">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="fcc"
                  required
                />
                <label className={`placeholder-label ${email && 'active'}`}>Enter Your Email</label>
              </div>
            </div>
            <div className="fgg">
              <div className="input-container">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`fcc ${isPasswordInvalid ? 'invalid' : ''}`}
                  required
                />
                <label className={`placeholder-label ${password && 'active'}`}>Enter Your Password</label>
              </div>
            </div>
            <p className={`pwch ${isPasswordInvalid ? 'invalid-text' : ''}`}>- Minimum 5 Characters</p>
            <div className="fgg">
              <div className="input-container">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="fcc"
                  required
                />
                <label className={`placeholder-label ${phone && 'active'}`}>Enter Your Phone</label>
              </div>
            </div>
            <div className="fgg">
              <div className="input-container">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="fcc"
                  required
                />
                <label className={`placeholder-label ${address && 'active'}`}>Enter Your Address</label>
              </div>
            </div>
            
            <div className="icd">
              <input type="checkbox" id="termsCheckbox" className="input-checkbox" onChange={handleCheckboxChange} />
              <label htmlFor="termsCheckbox" className="checkbox-label">I have read the terms and conditions</label>
            </div>
            <button type="submit" className="loginbtn">
              REGISTER
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
