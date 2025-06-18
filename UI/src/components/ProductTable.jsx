import React from 'react';
import { Link } from 'react-router-dom';

const ProductTable = ({ products }) => {
  return (
    <div className="product-grid">
      {products.map(product => (
        <div key={product.id} className="product-card">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
          />
          <div className="product-info" style={{ padding: '15px' }}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>${product.price.toFixed(2)}</span>
              <span>By: {product.artisan}</span>
            </div>
            <Link 
              to={`/products/${product.id}`} 
              style={{
                display: 'block',
                textAlign: 'center',
                marginTop: '10px',
                padding: '8px',
                backgroundColor: '#3498db',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px'
              }}
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductTable;