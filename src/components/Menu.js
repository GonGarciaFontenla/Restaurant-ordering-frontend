import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]); // Estado para los items del menú
  const [isLoading, setIsLoading] = useState(true); // Indicador de carga
  const [error, setError] = useState(null); // Estado de error
  const navigate = useNavigate(); // Inicializa el hook useNavigate

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
        setIsLoading(false); // Finaliza el estado de carga
      }
    };

    fetchMenuItems();
  }, []); // Dependencias vacías, se ejecuta una sola vez

  if (isLoading) {
    return <p>Loading menu...</p>; // Indicador de carga
  }

  if (error) {
    return <p>{error}</p>; // Mensaje de error
  }

  return (
    <div>
      <h1>Menu</h1>
      <ul>
        {menuItems.map(item => (
          <li key={item._id}>
            {item.name} - ${item.price.toFixed(2)} - {item.description} - {item.available ? 'Available' : 'Not available'}
          </li>
        ))}
      </ul>
      
      {/* Botón para agregar un nuevo item */}
      <button onClick={() => navigate('/addMenuItem')}>Add Menu Item</button>
      <button onClick={() => navigate('/deleteMenuItem')}>Remove Menu Item</button>
    </div>
  );
};

export default Menu;
