import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to Craft Cart</h1>
      <div className="card-container">
        <div className="feature-card">
          <h2>Employee Directory</h2>
          <p>View and manage all Products in your store</p>
          <Link to="/products" className="action-button">Go to Directory</Link>
        </div>
        <div className="feature-card">
          <h2>Add New Product</h2>
          <p>Create new Product records for Artisan</p>
          <Link to="/products" className="action-button">Add Product</Link>
        </div>
        <div className="feature-card">
          <h2>Reports</h2>
          <p>Generate reports and analytics</p>
          <Link to="/products" className="action-button">View Reports</Link>
        </div>
      </div>
    </div>
  );
}