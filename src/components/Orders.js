import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
        const res = await axios.get(`${baseUrl}/api/orders/getOrders`);
        setOrders(res.data);
      } catch (error) {
        console.error(error);
        setError(
          error.response?.data?.error || 
          "An unexpected error occurred while fetching orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
      await axios.delete(`${baseUrl}/api/orders/deleteOrder/${orderId}`);
      setOrders(orders.filter(order => order._id !== orderId)); 
    } catch (error) {
      console.error(error);
      alert('Failed to delete the order.');
    }
  };

  return (
    <div>
      <h1>Orders</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {orders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          orders.map(order => (
            <li key={order._id}>
              <strong>Table {order.tableNumber}</strong> - Status: {order.status}
              <ul>
                {order.items && order.items.length > 0 ? (
                  order.items.map(item => (
                    <li key={item._id}>{item.name || `Item ID: ${item._id}`}</li>
                  ))
                ) : (
                  <li>No items in this order</li>
                )}
              </ul>
              <button onClick={() => navigate(`/modifyOrder/${order._id}`)}>
                Modify Order
              </button>
              <button onClick={() => handleDeleteOrder(order._id)}>
                Delete Order
              </button>
            </li>
          ))
        )}
      </ul>
      <button onClick={() => navigate('/createOrder')}>Create order</button>
      <button onClick={() => navigate('/menu')}>Menu</button>
    </div>
  );
};

export default Orders;
