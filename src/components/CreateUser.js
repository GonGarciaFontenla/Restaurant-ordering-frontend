import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        <div>
            <h2>Crear nuevo usuario</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required
                    />
                </div>
                <div>
                <label htmlFor="password">Password:</label>
                    <input 
                        id="password"
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        aria-label="Password"
                    />
                </div>
                <div>
                    <label>Role:</label>
                    <input 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)} 
                        required
                    />
                </div>

                {error && <div style={{ color: 'red' }}>{error}</div>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Creating account...' : 'Create account'} 
                </button>
            </form>
        </div>
    );
};

export default CreateUser; 