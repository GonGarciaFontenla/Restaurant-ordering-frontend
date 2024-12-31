import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateOrder = () => {
    const [tableNumber, setTableNumber] = useState('');
    const [items, setItems] = useState([]);
    const [availableItems, setAvailableItems] = useState([]); // Lista de ítems disponibles
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch available menu items on component mount
    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
                const response = await axios.get(`${baseUrl}/api/menu`); // Suponiendo que /api/menu proporciona los ítems disponibles
                setAvailableItems(response.data.items);
                setItems(response.data.items.map(item => ({ item: item._id, name: item.name, quantity: 0 })));
            } catch (error) {
                console.error(error);
                setError('Failed to fetch menu items.');
            }
        };

        fetchMenuItems();
    }, []);

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const filteredItems = items.filter(item => item.quantity > 0);

        try {
            const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
            const response = await axios.post(
                `${baseUrl}/api/orders/createOrder`,
                { tableNumber, items: filteredItems }
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
                    <label>Número de Mesa:</label>
                    <input 
                        type="number" 
                        value={tableNumber} 
                        onChange={(e) => setTableNumber(e.target.value)} 
                        required
                    />
                </div>
                <div>
                    <label>Items:</label>
                    {items.map((item, index) => (
                        <div key={index} style={{ marginBottom: '20px' }}>
                            <input 
                                type="text" 
                                value={item.name} 
                                readOnly 
                                style={{
                                    backgroundColor: '#A9A9A9',
                                    border: '1px solid #ccc',
                                    padding: '5px',
                                    borderRadius: '4px',
                                    width: 'auto'   
                                }}
                            />
                            <input 
                                type="number" 
                                placeholder="Cantidad" 
                                value={item.quantity} 
                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} 
                                required
                                min="0"
                                style={{ 
                                        backgroundColor: '#D3D3D3',
                                        border: '1px solid #ccc',
                                        padding: '5px',
                                        borderRadius: '4px',
                                        width: '50px',   
                                        marginLeft: '10px'
                                }}  
                            />
                        </div>
                    ))}
                </div>

                {error && <div style={{ color: 'red' }}>{error}</div>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Creando orden...' : 'Crear orden'}
                </button>
            </form>
        </div>
    );
};

export default CreateOrder;
