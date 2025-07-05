import React, { useState, useEffect, useRef } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductList.module.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:5000';

/**
 * Loader component shown during data fetching.
 */
const Loader = () => (
  <div className={styles.loaderContainer}>
    <div className={styles.loader}></div>
  </div>
);

/**
 * Error message component displayed when data fetching fails.
 * @param {object} props
 * @param {string} props.message - Error description to be displayed.
 */
const ErrorMessage = ({ message }) => (
  <div className={styles.errorContainer}>
    <h3>An Error Occurred</h3>
    <p>{message}</p>
  </div>
);

/**
 * ProductList component fetches and displays a scrollable list of product cards.
 * It supports horizontal navigation and provides user feedback on loading or error states.
 *
 * @component
 * @returns {JSX.Element} Scrollable product list with navigation arrows
 */
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/products`)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => setProducts(data))
      .catch(err => setError('Products could not be loaded. Make sure the backend server is running.'))
      .finally(() => setLoading(false));
  }, []);

  /**
   * Scrolls the product list horizontally in the specified direction.
   * @param {'left'|'right'} direction - Direction to scroll the list
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
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
        <button className={`${styles.navBtn} ${styles.right}`} onClick={() => scroll('right')} aria-label="Scroll Right"><FaChevronRight /></button>
      </div>
    </div>
  );
};

export default ProductList;