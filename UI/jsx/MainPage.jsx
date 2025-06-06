import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { NavPage } from "./NavPage.jsx";
import './NavPage.css'; // Import the CSS

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <NavPage />
  </Router>
);