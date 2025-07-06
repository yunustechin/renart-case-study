import React, { useState, useEffect, useRef, useCallback } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductList.module.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';


/**
 * Loading indicator shown during data fetch.
 * @returns {JSX.Element}
 */
const Loader = () => (
  <div className={styles.loaderContainer}>
    <div className={styles.loader}></div>
  </div>
);

/**
 * Error display component.
 * @param {Object} props
 * @param {string} props.message - Error text
 * @returns {JSX.Element}
 */
const ErrorMessage = ({ message }) => (
  <div className={styles.errorContainer}>
    <h3>An Error Occurred</h3>
    <p>{message}</p>
  </div>
);

/**
 * Renders and manages a horizontally scrollable product list.
 * @returns {JSX.Element}
 */
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [productColors, setProductColors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetch('/products')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        setProducts(data);
        const initialColors = data.reduce((acc, product) => {
          acc[product.id] = 'yellow'; 
          return acc;
        }, {});
        setProductColors(initialColors);
      })
      .catch(err => setError('Products could not be loaded. Make sure the backend server is running.'))
      .finally(() => setLoading(false));
  }, []);

  /**
   * Updates selected color of a product.
   * @param {number|string} productId 
   * @param {string} color 
   */
  const handleColorChange = useCallback((productId, color) => {
    setProductColors(prevColors => ({
      ...prevColors,
      [productId]: color,
    }));
  }, []);

  /**
   * Scrolls the product list horizontally.
   * @param {'left'|'right'} direction 
   */
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth * 0.8;
      scrollRef.current.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className={styles.productListContainer} style={{ backgroundColor: 'white' }}>
      <h2 className={styles.listTitle}>Product List</h2>
      <div className={styles.navigationWrapper}>
        <button className={`${styles.navBtn} ${styles.left}`} onClick={() => scroll('left')} aria-label="Scroll Left"><FaChevronLeft /></button>
        <div className={styles.productList} ref={scrollRef}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              selectedColor={productColors[product.id]}
              onColorChange={handleColorChange}
            />
          ))}
        </div>
        <button className={`${styles.navBtn} ${styles.right}`} onClick={() => scroll('right')} aria-label="Scroll Right"><FaChevronRight /></button>
      </div>
    </div>
  );
};

export default ProductList;