import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AddMenuItem = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [available, setAvailable] = useState(true);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);

    // Check if the user has the admin role when the component loads
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (1) {
                    setIsAdmin(true);
                } else {
                    navigate('/menu');  // Redirect to the menu page if not admin
                }
            } catch (error) {
                navigate('/login');  // Redirect to login if there's an error decoding the token
            }
        } else {
            navigate('/login');  // Redirect to login if there's no token
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (name.trim() === '' || price.trim() === '' || description.trim() === '') {
            setError('All fields are required.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
            const response = await axios.post(
                `${baseUrl}/api/menu`,
                { name, price, description, available }
                // {
                //   headers: { Authorization: `Bearer ${token}` }
                // }
            );
            alert('Item added successfully');
            navigate('/menu');
        } catch (error) {
            console.error(error);
            setError('Failed to add item to the menu.');
        } finally {
            setLoading(false);
        }
    };

    if (!isAdmin) {
        return <div>You do not have permission to add menu items.</div>;
    }

    return (
        <div>
            <h2>Add Menu Item</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required
                    />
                </div>
                <div>
                    <label>Price:</label>
                    <input 
                        type="number" 
                        value={price} 
                        onChange={(e) => setPrice(e.target.value)} 
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        required
                    />
                </div>
                <div>
                    <label>Available:</label>
                    <input 
                        type="checkbox" 
                        checked={available} 
                        onChange={() => setAvailable(!available)} 
                    />
                </div>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Adding item...' : 'Add Item'}
                </button>
            </form>
        </div>
    );
};

export default AddMenuItem;
