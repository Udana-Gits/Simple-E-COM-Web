import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetails = ({ inventory }) => {
  const { id } = useParams();
  const product = inventory.find((item) => item.id === id);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="product-details">
      <img src={product.image} alt={product.name} />
      <h2>{product.name}</h2>
      <p>Price: ${product.price}</p>
      <p>Quantity: {product.quantity}</p>
      <p>Category: {product.category}</p>
      <button>Buy Now</button>
    </div>
  );
};

export default ProductDetails;
