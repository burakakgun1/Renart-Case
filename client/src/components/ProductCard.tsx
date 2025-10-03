import React, { useState } from 'react';
import { Product, ColorOption } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [selectedColor, setSelectedColor] = useState<ColorOption>('yellow');

  const formatPrice = (price: number | undefined): string => {
    if (!price) return '$0.00';
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const renderStars = (rating: number | undefined) => {
    if (!rating) {
      return (
        <>
          <span className="stars-filled">{'★'.repeat(0)}</span>
          <span className="stars-empty">{'★'.repeat(5)}</span>
        </>
      );
    }
    
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    
    return (
      <>
        <span className="stars-filled">{'★'.repeat(fullStars)}</span>
        <span className="stars-empty">{'★'.repeat(emptyStars)}</span>
      </>
    );
  };

  const formatRating = (rating: number | undefined): string => {
    if (!rating) return '0.0';
    return rating.toFixed(1);
  };

  const colorNames: Record<ColorOption, string> = {
    yellow: 'Yellow Gold',
    rose: 'Rose Gold',
    white: 'White Gold'
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.images[selectedColor]}
          alt={`${product.name} in ${colorNames[selectedColor]}`}
          className="product-image"
          loading="lazy"
        />
      </div>
      
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        
        <div className="product-price">
          {formatPrice(product.price)} USD
        </div>
        
        <div className="color-picker">
          {Object.keys(product.images).map((color) => (
            <button
              key={color}
              className={`color-option ${color} ${selectedColor === color ? 'active' : ''}`}
              onClick={() => setSelectedColor(color as ColorOption)}
              title={colorNames[color as ColorOption]}
              aria-label={`Select ${colorNames[color as ColorOption]}`}
            />
          ))}
        </div>
        
        <div className="color-name">{colorNames[selectedColor]}</div>
        
        <div className="star-rating">
          <div className="stars-container">{renderStars(product.starRating)}</div>
          <span>{formatRating(product.starRating)}/5</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
