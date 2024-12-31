import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const DeleteMenuItem = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Cargar el menú al montar el componente
    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
                const res = await axios.get(`${baseUrl}/api/menu`);

                // Verifica que los items están en la respuesta y que es un array
                if (res.data && Array.isArray(res.data.items)) {
                    setMenuItems(res.data.items); // Establece los items del menú
                } else {
                    throw new Error('Invalid menu items data');
                }
            } catch (err) {
                setError('Error loading menu. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false); // Finaliza el estado de carga
            }
        };

        fetchMenuItems();
    }, []); // Dependencias vacías, se ejecuta una sola vez

    // Eliminar un ítem del menú
    const deleteMenuItem = async (itemId) => {
        const confirmed = window.confirm('Are you sure you want to delete this menu item?');
        if (!confirmed) return;

        try {
            await axios.delete(`http://localhost:3000/api/menu/${itemId}`);
            alert('Menu item deleted successfully!');
            setMenuItems(menuItems.filter((item) => item._id !== itemId)); // Actualizar el estado
        } catch (err) {
            alert('Failed to delete menu item.');
            console.error(err);
        }
    };

    if (loading) return <p>Loading menu items...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Delete Menu Item</h1>
            {menuItems.length === 0 ? (
                <p>No items on the menu</p>
            ) : (
                <ul>
                    {menuItems.map((item) => (
                        <li key={item._id}>
                            {item.name} - ${item.price}
                            <button onClick={() => deleteMenuItem(item._id)} style={{ marginLeft: '10px', color: 'red' }}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <button onClick={() => navigate('/menu')}>Accept</button>
        </div>
    );
};

export default DeleteMenuItem;
