import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await newRequest.post(`/auth/reset-password/${token}`, { password });
      setMessage("Password has been reset.");
      navigate("/login");
    } catch (err) {
      setMessage("Error resetting password.");
    }
  };

  return (
    <div className="reset-password">
      <form onSubmit={handleSubmit}>
        <h1>Reset Password</h1>
        <label htmlFor="password">New Password</label>
        <input
          name="password"
          type="password"
          placeholder="New Password..."
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Reset Password</button>
        {message && <div className="message">{message}</div>}
      </form>
    </div>
  );
}

export default ResetPassword;
