import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from '../../assets/bbl.png';

//css login.css

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/auth/forgot-password", { email });
      if (res && res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Forgot Password - Ecommerce APP"}>
      <div className="forgotpw">
      <div className="imgdescall">
        <img src={logo} width="200px" height="280px"  className="logoimg" alt="Logo"/>
        <h2>Forgot Password</h2>
        <p>You will get a code in your email for reseting your password.</p>
      </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 forminput">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="Enter Your Email"
              required
            /><button type="submit" className="forgotbutton">
            RESET
          </button>
          </div>
          
        </form>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
