import React, { useState } from "react";
import { auth } from "./Firebase"; // Import your Firebase config
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Login successful!");
      navigate("/adminpage")
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setMessage("Please enter your email to reset your password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Login</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="password">Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", marginTop: "5px" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <button type="submit" style={{ padding: "10px", width: "100%" }}>
          Login
        </button>
      </form>
      <button
        onClick={handleResetPassword}
        style={{
          marginTop: "10px",
          padding: "10px",
          width: "100%",
          background: "#007BFF",
          color: "#FFF",
          border: "none",
          cursor: "pointer",
        }}
      >
        Forgot Password
      </button>
    </div>
  );
};

export default LoginPage;
