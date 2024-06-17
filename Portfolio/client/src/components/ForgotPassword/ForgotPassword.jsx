import React, { useState } from "react";
import newRequest from "../../utils/newRequest";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await newRequest.post("/auth/forgot-password", { email });
      setMessage(res.data);
    } catch (err) {
      setMessage("Error sending password reset link.");
    }
  };

  return (
    <div className="forgot-password">
      <form onSubmit={handleSubmit}>
        <h1>Forgot Password</h1>
        <label htmlFor="email">Email</label>
        <input
          name="email"
          type="email"
          placeholder="Your Email..."
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Send Reset Link</button>
        {message && <div className="message">{message}</div>}
      </form>
    </div>
  );
}

export default ForgotPassword;
