import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import styles from './MenuItemCard.module.css';

const MenuItemCard = ({ name, description, price, available }) => {
  return (
    <div className={styles.card}>
      <h4 className={styles.name}>{name}</h4>
      <p className={styles.description}>{description}</p>
      <span className={styles.price}>${price.toFixed(2)}</span>
      <p className={styles.availability}>
        {available ? (
          <FontAwesomeIcon icon={faCheckCircle} className={styles.iconAvailable} />
        ) : (
          <FontAwesomeIcon icon={faTimesCircle} className={styles.iconNotAvailable} />
        )}
        {available ? 'Available' : 'Not available'}
      </p>
    </div>
  );
};

export default MenuItemCard;
