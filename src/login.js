// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Username and Password are required');
      return;
    }
    localStorage.setItem('username', username);
    onLogin(username);
    navigate('/dashboard');
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="left-panel">
          <img src="/favicon.png" alt="App Logo" width="80" />
          <h3>Welcome Back!</h3>
          <p>Organize your tasks effortlessly ✨</p>
        </div>
        <div className="right-panel">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <div className="error-text">{error}</div>}
            <div className="actions">
              <a className="forgot" href="/forgot-password">Forgot Password?</a>
              <button type="submit">Login</button>
            </div>
          </form>
          <div className="register-link">
            Don’t have an account? <a href="/register">Register Now</a>
          </div>

          <div className="alt-login">
            <p>Or login using</p>
            <div className="social-buttons">
              <button className="google">Google</button>
              <button className="facebook">Facebook</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
