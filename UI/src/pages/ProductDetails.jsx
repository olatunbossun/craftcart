import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
  const { id } = useParams();
  return (
    <div>
      <h1>Product Details</h1>
      <p>Viewing product {id}</p>
    </div>
  );
};

export default ProductDetails;