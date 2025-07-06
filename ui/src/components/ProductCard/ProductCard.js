import React, { useState, useEffect, useRef } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductCard.module.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

/**
 * A reusable loader component displayed while data is being fetched.
 * @returns {JSX.Element} A spinning loader animation.
 */
const Loader = () => (
  <div className={styles.loaderContainer}>
    <div className={styles.loader}></div>
  </div>
);

/**
 * A reusable component to display an error message when data fetching fails.
 * @param {object} props - The component props.
 * @param {string} props.message - The error description to be displayed.
 * @returns {JSX.Element} A formatted error message container.
 */
const ErrorMessage = ({ message }) => (
  <div className={styles.errorContainer}>
    <h3>An Error Occurred</h3>
    <p>{message}</p>
  </div>
);

/**
 * Fetches and displays a scrollable list of products. It includes
 * navigation controls to scroll horizontally and handles loading and error states.
 * @returns {JSX.Element} A horizontally scrollable list of ProductCards with navigation.
 */
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetch('/products')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setProducts(data))
      .catch(err => setError('Products could not be loaded. Make sure the backend server is running.'))
      .finally(() => setLoading(false));
  }, []);

  /**
   * Scrolls the product list horizontally.
   * @param {'left' | 'right'} direction - The direction in which to scroll.
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
    <div className={styles.productListContainer}>
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