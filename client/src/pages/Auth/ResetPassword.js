import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import logo from '../../assets/bbl.png';


const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/v1/auth/reset-password/${token}`, { newPassword });
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
    <Layout title={"Reset Password - Ecommerce APP"}>
      <div className="resetpw">
      <div className="imgdescall">
        <img src={logo} width="250px" height="300px" className="logoimg" alt="Logo"/>
        <h2>Reset Password</h2>
        <h3>Reset your password here</h3>
        <p>You will get a code in your email for reseting your password.</p>
      </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 forminput">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-control"
              placeholder="Enter New Password"
              required
            />
            <button type="submit" className="forgotbutton">
            RESET
          </button>
          </div>
          
        </form>
      </div>
    </Layout>
  );
};

export default ResetPassword;
