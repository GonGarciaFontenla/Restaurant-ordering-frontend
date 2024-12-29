import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ModifyOrder = () => {
  const [tableNumber, setTableNumber] = useState('');
  const [items, setItems] = useState([]); // Almacena los IDs de los artículos seleccionados
  const [availableItems, setAvailableItems] = useState([]); // Almacena los artículos disponibles
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { orderId } = useParams(); // Obtiene el ID de la orden desde los parámetros de la URL

  // Cargar detalles de la orden existente
  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
        const orderResponse = await axios.get(`${baseUrl}/api/orders/getOrder/${orderId}`);
        const itemsResponse = await axios.get(`${baseUrl}/api/items`); 

        setTableNumber(orderResponse.data.tableNumber);
        setItems(orderResponse.data.items.map(item => item._id)); // Extrae los IDs de los artículos
        setAvailableItems(itemsResponse.data); // Opcional: lista de artículos disponibles
      } catch (error) {
        console.error(error);
        setError('Failed to fetch order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
      await axios.put(`${baseUrl}/api/orders/modifyOrder/${orderId}`, {
        tableNumber,
        items,
      });
      alert('Order modified successfully');
      navigate('/orders');
    } catch (error) {
      console.error(error);
      setError('Failed to modify order.');
    } finally {
      setLoading(false);
    }
  };

  const handleItemChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setItems([...items, value]); // Agrega el artículo
    } else {
      setItems(items.filter(item => item !== value)); // Elimina el artículo
    }
  };

  return (
    <div>
      <h2>Modify Order</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Table Number:</label>
            <input
              type="number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Items:</label>
            <ul>
              {availableItems.map(item => (
                <li key={item._id}>
                  <label>
                    <input
                      type="checkbox"
                      value={item._id}
                      checked={items.includes(item._id)}
                      onChange={handleItemChange}
                    />
                    {item.name}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <button type="submit">Modify Order</button>
        </form>
      )}
      <button onClick={() => navigate('/orders')}>Cancel</button>
    </div>
  );
};

export default ModifyOrder;

