import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateOrder = () => {
    const [tableNumber, setTableNumber] = useState('');
    const [items, setItems] = useState([]);  // Cambiado de string a array
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
            const response = await axios.post(
                `${baseUrl}/api/orders/createOrder`,
                { tableNumber, items }  // Solo enviamos tableNumber y items
            );
            alert('Order created successfully');
            navigate('/orders');
        } catch (error) {
            console.error(error);
            setError('Failed to create order.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Crear nueva orden</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>tableNumber:</label>
                    <input 
                        type="number" 
                        value={tableNumber} 
                        onChange={(e) => setTableNumber(e.target.value)} 
                        required
                    />
                </div>
                <div>
                    <label>items (ID del menú):</label>
                    <input 
                        type="text" 
                        value={items} 
                        onChange={(e) => setItems(e.target.value.split(','))}  // Convertir a array
                        required
                    />
                </div>

                {error && <div style={{ color: 'red' }}>{error}</div>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Creating order...' : 'Create order'} 
                </button>
            </form>
        </div>
    );
};

export default CreateOrder;
