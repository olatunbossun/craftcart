import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const featuredProducts = [
    {
      id: 1,
      name: "Featured Handmade Vase",
      description: "Beautiful ceramic vase with unique patterns",
      price: 65.99,
      imageUrl: "/img/vase.jpg"
    },
    {
      id: 2,
      name: "Artisan Wooden Chair",
      description: "Handcrafted oak chair with comfortable cushion",
      price: 120.00,
      imageUrl: "/img/chair.jpg"
    }
  ];

  return (
    <div className="home-container">
      <h1>Welcome to CraftCart</h1>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Featured Products</h2>
      
      <div className="card-container">
        {featuredProducts.map(product => (
          <div key={product.id} className="feature-card">
            <img 
              src={product.imageUrl} 
              alt={product.name}
              style={{ 
                width: '100%', 
                height: '200px', 
                objectFit: 'cover',
                borderRadius: '8px 8px 0 0'
              }}
            />
            <div style={{ padding: '1rem' }}>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p style={{ fontWeight: 'bold' }}>${product.price.toFixed(2)}</p>
              <Link 
                to={`/products/${product.id}`} 
                className="action-button"
              >
                View Product
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="card-container" style={{ marginTop: '3rem' }}>
        <div className="feature-card">
          <h2>Browse All Products</h2>
          <p>Discover unique handmade items from local artisans</p>
          <Link to="/products" className="action-button">View Marketplace</Link>
        </div>
        <div className="feature-card">
          <h2>For Artisans</h2>
          <p>Sell your handmade creations on our platform</p>
          <Link to="/artisan" className="action-button">Artisan Dashboard</Link>
        </div>
      </div>
    </div>
  );
}