import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import style from './Login.module.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  // State for error messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación avanzada
    if (username.trim() === '' || password.trim() === '') {
      setError('Username and password are required.');
      return;
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      setError('Username must contain only alphanumeric characters.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError(null); 
    try {
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
      const res = await axios.post(`${baseUrl}/api/users/login`, { username, password });

      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
        navigate('/orders');
      } else {
        setError('Login failed: Token not received.');
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        setError(`Error: ${error.response.data.message || 'An error occurred.'}`);
      } else if (error.request) {
        setError('Error: No response from the server. Please try again later.');
      } else {
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
  <div class = {style.body}>
    <div class = {style.wrapper}>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>

        <div class = {style.inputbox}>
          <input 
            id="username"
            type="text" 
            autocomplete="off"
            placeholder='Username'
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 

          />
          <i class='bx bxs-user'></i>
        </div>

        <div class = {style.inputbox}>
          <input 
            placeholder='Password'
            id="password"
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <i class='bx bxs-lock-alt' ></i>
        </div>

        {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error message */}

        <button type="submit" disabled={loading} class = {style.btn}>  
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div class = {style.registerLink}>
          <p>Don't have an account? <a href="#" onClick={() => navigate('/createUser')}>Register</a></p>
        </div>

      </form>
      </div>
    </div>
  );
};

export default Login;
