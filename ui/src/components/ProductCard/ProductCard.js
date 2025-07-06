import React from 'react';
import styles from './ProductCard.module.css';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const COLOR_OPTIONS = {
    yellow: { name: 'Yellow Gold' },
    white: { name: 'White Gold' },
    rose: { name: 'Rose Gold' },
};

/**
 * StarRating component to visually represent a product's popularity score.
 * It renders full, half, and empty stars based on the given rating.
 *
 * @param {object} props
 * @param {number} props.rating - Rating between 0 and 5
 * @returns {JSX.Element}
 */
const StarRating = ({ rating }) => {
    const ratingText = parseFloat(rating).toFixed(1);
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
        <div className={styles.starRating}>
            <div className={styles.stars}>
                {[...Array(fullStars)].map((_, i) => <FaStar key={`full-${i}`} />)}
                {halfStar && <FaStarHalfAlt />}
                {[...Array(emptyStars)].map((_, i) => <FaRegStar key={`empty-${i}`} />)}
            </div>
            <span className={styles.ratingText}>{ratingText}/5</span>
        </div>
    );
};

/**
 * ProductCard component displays a single product's information including:
 * - Product image (by selected color)
 * - Product name and dynamic price
 * - Color selector and rating
 *
 * @param {object} props
 * @param {object} props.product - Product object containing details and images
 * @returns {JSX.Element|null}
 */
const ProductCard = ({ product, selectedColor, onColorChange }) => {
    if (!product?.images || !selectedColor) {
        return null;
    }

    return (
        <div className={styles.productCard}>
            <div className={styles.productImageContainer}>
                <img
                    src={product.images[selectedColor]}
                    alt={`${product.name} - ${COLOR_OPTIONS[selectedColor].name}`}
                    className={styles.productImage}
                    onError={(e) => { e.target.src = 'https://placehold.co/400x400/f7f7f7/ccc?text=No+Picture'; }}
                />
            </div>
            <div className={styles.productInfo}>
                <h3 className={styles.productTitle}>{product.name}</h3>
                <p className={styles.productPrice}>${product.dynamicPrice?.toFixed(2)} USD</p>
                <div className={styles.colorPicker}>
                    {Object.keys(COLOR_OPTIONS).map((color) => (
                        <div
                            key={color}
                            className={`${styles.colorSwatch} ${selectedColor === color ? styles.selected : ''}`}
                            style={{ backgroundColor: `var(--color-${color}-gold)` }}
                            onClick={() => onColorChange(product.id, color)}
                        />
                    ))}
                </div>
                <p className={styles.colorName}>{COLOR_OPTIONS[selectedColor].name}</p>
                <StarRating rating={product.popularityScore * 5} />
            </div>
        </div>
    );
};

export default React.memo(ProductCard);