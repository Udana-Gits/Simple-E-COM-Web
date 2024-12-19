import React, { useState } from 'react';
import { getDatabase, ref, get, update } from 'firebase/database';
import { app } from './Firebase'; // Import Firebase configuration
import '../CSS/EditProduct.css'; // Import the CSS file

const EditProduct = () => {
  const [productId, setProductId] = useState('');
  const [product, setProduct] = useState({
    name: '',
    price: '',
    quantity: '',
    category: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to handle product search
  const handleSearch = async () => {
    if (!productId) {
      setError('Product ID is required.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const db = getDatabase(app);
    const productRef = ref(db, 'products/' + productId);
    
    try {
      const snapshot = await get(productRef);
      if (snapshot.exists()) {
        setProduct(snapshot.val());
      } else {
        setError('Product not found.');
      }
    } catch (error) {
      setError('Error fetching product data.');
    }
    setLoading(false);
  };

  // Function to handle form submission
  const handleUpdate = async () => {
    if (!product.name || !product.price || !product.quantity) {
      setError('All fields are required.');
      return;
    }
    if (isNaN(product.price) || isNaN(product.quantity)) {
      setError('Price and Quantity must be numbers.');
      return;
    }

    setLoading(true);
    setError('');
    
    const db = getDatabase(app);
    const productRef = ref(db, 'products/' + productId);

    try {
      await update(productRef, {
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        category: product.category
      });
      alert('Product updated successfully.');
    } catch (error) {
      setError('Error updating product data.');
    }
    setLoading(false);
  };

  return (
    <div className="edit-product-container">
      <h1>Edit Product</h1>
      <div>
        <input
          type="text"
          placeholder="Enter Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>Search</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {productId && product && (
        <div className="product-form">
          <label>Name:</label>
          <input
            type="text"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
          />
          
          <label>Price:</label>
          <input
            type="text"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
          />
          
          <label>Quantity:</label>
          <input
            type="text"
            value={product.quantity}
            onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
          />
          
          <label>Category:</label>
          <input
            type="text"
            value={product.category}
            onChange={(e) => setProduct({ ...product, category: e.target.value })}
          />
          
          <button onClick={handleUpdate} disabled={loading}>Update</button>
        </div>
      )}
    </div>
  );
};

export default EditProduct;
