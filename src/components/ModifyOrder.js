import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ModifyOrder = () => {
  const [tableNumber, setTableNumber] = useState('');
  const [items, setItems] = useState([]); // Cambiado a array de objetos con item y quantity
  const [availableItems, setAvailableItems] = useState([]); // Available items list
  const [status, setStatus] = useState(''); // Status of the order
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { orderId } = useParams(); // Get the order ID from URL params

  // Fetch order details and available items
  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
        const orderResponse = await axios.get(`${baseUrl}/api/orders/getOrdersById/${orderId}`);
        const itemsResponse = await axios.get(`${baseUrl}/api/menu`); // Assuming /api/menu provides available items

        setTableNumber(orderResponse.data.tableNumber);
        setStatus(orderResponse.data.status);

        // Unificar ítems del menú con ítems de la orden
        const unifiedItems = itemsResponse.data.items.map(menuItem => {
          const orderItem = orderResponse.data.items.find(item => item.item._id === menuItem._id);
          return {
            item: menuItem._id,
            name: menuItem.name,
            quantity: orderItem ? orderItem.quantity : 0
          };
        });

        setItems(unifiedItems);
        setAvailableItems(itemsResponse.data.items); // Set the available items

      } catch (err) {
        console.error(err);
        setError('Failed to fetch order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Filtrar ítems con cantidad mayor a 0 antes de enviar la solicitud
    const filteredItems = items.filter(item => item.quantity > 0);

    try {
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
      await axios.put(`${baseUrl}/api/orders/modifyOrder/${orderId}`, {
        tableNumber,
        items: filteredItems,
        status, // Include status in the request body
      });
      alert('Order modified successfully!');
      navigate('/orders');
    } catch (err) {
      console.error(err);
      setError('Failed to modify order.');
    } finally {
      setLoading(false);
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  return (
    <div>
      <h2>Modify Order</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form id="modify-order-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="table-number">Table Number:</label>
          <input
            type="number"
            id="table-number"
            name="tableNumber"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Items in this order:</label>
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

        <div>
          <label htmlFor="order-status">Status:</label>
          <select
            id="order-status"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <button type="submit" id="submit-button" disabled={loading}>
            {loading ? 'Submitting...' : 'Modify Order'}
          </button>
          <button
            type="button"
            id="cancel-button"
            onClick={() => navigate('/orders')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModifyOrder;
