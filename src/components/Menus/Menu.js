import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Menu.module.css'; 
import MenuItemCard from './MenuItemCard';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All'); // Nuevo estado para la categoría seleccionada
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
        const res = await axios.get(`${baseUrl}/api/menu`);

        if (res.data && Array.isArray(res.data.items)) {
          setMenuItems(res.data.items);
        } else {
          throw new Error('Invalid menu items data');
        }
      } catch (err) {
        setError('Error loading menu. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  if (isLoading) {
    return <p className={styles.loading}>Loading menu...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <div className={styles.body}>
      <div className={styles.menu}>
        <h1>Menu</h1>
        
        {/* Filtros por categoría */}
        <div className={styles.filters}>
          <button onClick={() => handleCategoryChange('All')}>All</button>
          <button onClick={() => handleCategoryChange('Entradas')}>Entradas</button>
          <button onClick={() => handleCategoryChange('Platos Principales')}>Platos Principales</button>
          <button onClick={() => handleCategoryChange('Postres')}>Postres</button>
          <button onClick={() => handleCategoryChange('Bebidas')}>Bebidas</button>
        </div>

        <div className={styles.menuCategory}>
          {filteredItems.map(item => (
            <MenuItemCard
              key={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              available={item.available}
            />
          ))}
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={() => navigate('/addMenuItem')}>Add Menu Item</button>
          <button className={styles.button} onClick={() => navigate('/deleteMenuItem')}>Remove Menu Item</button>
        </div>
      </div>
    </div>
  );
};

export default Menu;
