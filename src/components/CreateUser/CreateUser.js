import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import style from './CreateUser.module.css';

const CreateUser = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (role !== 'admin' && role !== 'waiter') {
            setError('Role must be waiter or admin. ');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
            const response = await axios.post(
                `${baseUrl}/api/users/register`,
                { username, password, role}
            );
            alert('User created successfully');
            navigate('/login');
        } catch (error) {
            console.error(error);
            setError('Failed to create user.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div class = {style.body}>
            <div class = {style.wrapper}>
                <h1>Sign Up</h1>
                <form onSubmit={handleSubmit}>
                    <div class = {style.inputbox}>
                        <input 
                            placeholder='Username'
                            type="text" 
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
                            aria-label="Password"
                        />
                        <i class='bx bxs-lock-alt' ></i>
                    </div>
                    <div class = {style.inputbox}>
                        <input 

                            placeholder='Role (admin or waiter)'
                            value={role} 
                            onChange={(e) => setRole(e.target.value)} 
                            required
                        />
                        <i class='bx bx-cog'></i>
                    </div>

                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    <button type="submit" disabled={loading} class = {style.btn}>
                        {loading ? 'Creating account...' : 'Create account'} 
                    </button>

                <div class = {style.registerLink}>
                    <p>Already have an account? <a href="#" onClick={() => navigate('/login')}>Sign in</a></p>
                </div>
                </form>
            </div>
        </div>
    );
};

export default CreateUser; 