import React from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import "./NavPage.css";

export function NavPage() {
  return (
    <div className="app-container">
      <nav className="main-nav">
        <div className="nav-brand">Product Management</div>
        <div className="nav-links">
          <NavLink to="/" className="nav-link" end>Home</NavLink>
          <NavLink to="/products" className="nav-link">Products</NavLink>
        </div>
      </nav>
      
      <div className="content-area">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductDirectory />} />
        </Routes>
      </div>
    </div>
  );
}