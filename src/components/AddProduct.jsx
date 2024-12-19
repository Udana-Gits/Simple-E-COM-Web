import React, { useState } from 'react';
import { ref, set } from 'firebase/database';
import { db } from './Firebase'; // Import Firebase config
import '../CSS/AddProduct.css'; // Import the CSS file

const AddProduct = () => {
  const [product, setProduct] = useState({
    id: '',
    name: '',
    price: '',
    quantity: '',
    category: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !product.id ||
      !product.name ||
      product.price <= 0 ||
      product.quantity <= 0
    ) {
      alert('Please provide valid inputs.');
      return;
    }

    try {
      // Prepare product data to store in the Realtime Database
      const productData = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        category: product.category,
      };

      // Store the product data in Firebase Realtime Database
      const productRef = ref(db, `products/${product.id}`);
      await set(productRef, productData);

      alert('Product added successfully!');

      // Reset the form
      setProduct({
        id: '',
        name: '',
        price: '',
        quantity: '',
        category: '',
      });
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-product-form">
      <input
        name="id"
        type="text"
        placeholder="Product ID (e.g., P0001)"
        value={product.id}
        onChange={handleChange}
        required
        className="form-input"
      />
      <input
        name="name"
        type="text"
        placeholder="Name"
        value={product.name}
        onChange={handleChange}
        required
        className="form-input"
      />
      <input
        name="price"
        type="number"
        placeholder="Price"
        value={product.price}
        onChange={handleChange}
        required
        className="form-input"
      />
      <input
        name="quantity"
        type="number"
        placeholder="Quantity"
        value={product.quantity}
        onChange={handleChange}
        required
        className="form-input"
      />
      <input
        name="category"
        type="text"
        placeholder="Category"
        value={product.category}
        onChange={handleChange}
        required
        className="form-input"
      />
      <button type="submit" className="submit-button">
        Add Product
      </button>
    </form>
  );
};

export default AddProduct;
