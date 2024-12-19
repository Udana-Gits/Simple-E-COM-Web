import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from './Firebase'; // Import Firebase config
import '../CSS/ProductGrid.css'; // Import the CSS file

const ProductGrid = () => {
  const categoryImages = {
    Fashion: require('../images/fashion.png'),
    Beauty: require('../images/beauty.png'),
    Sports: require('../images/sports.png'),
    Electronics: require('../images/electronics.png'),
  };

  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(''); // Track selected category
  const [inventory, setInventory] = useState([]); // State to store inventory from Firebase
  const navigate = useNavigate();

  const slideshowImages = ['ad1.jpg', 'ad2.jpg', 'ad3.jpg', 'ad4.jpg', 'ad5.jpg'];

  useEffect(() => {
    // Fetch inventory data from Firebase Realtime Database
    const inventoryRef = ref(db, 'products');
    onValue(inventoryRef, (snapshot) => {
      const data = snapshot.val();
      const productList = data ? Object.values(data) : [];
      setInventory(productList);
    });
  }, []);

  // Filter products by selected category
  const filteredInventory = selectedCategory
    ? inventory.filter((item) => item.category === selectedCategory)
    : inventory;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshowImages.length);
    }, 2000); // Change slide every 2 seconds

    return () => clearInterval(interval);
  }, [slideshowImages.length]);

  return (
    <div className="product-grid-container">
      {/* Slideshow */}
      <div className="slideshow">
        <img
          src={require(`../images/${slideshowImages[currentSlide]}`)}
          alt={`Slide ${currentSlide + 1}`}
          className="slideshow-image"
        />
      </div>

      {/* Category Buttons */}
      <div className="categories">
        {Object.keys(categoryImages).map((cat) => (
          <button
            key={cat}
            className={`category-button ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)} // Set selected category
          >
            <img
              src={categoryImages[cat]}
              alt={cat}
              className="category-image"
            />
            <span>{cat}</span>
          </button>
        ))}
        <button
          className="category-button"
          onClick={() => setSelectedCategory('')} // Reset category filter
        >
          <span>All Products</span>
        </button>
      </div>

      {/* Product Grid */}
      <div className="product-grid">
        {filteredInventory.length > 0 ? (
          filteredInventory.map((item) => (
            <div
              key={item.id}
              className="product-card"
              onClick={() => navigate(`/product/${item.id}`)} // Navigate to product details
              style={{ flex: '1 1 calc(20% - 10px)', margin: '5px' }} // Adjust to show 5 in a row
            >
              <img
                src={categoryImages[item.category] || categoryImages['Electronics']} // Fallback to Electronics image
                alt={item.name}
                className="product-image"
              />
              <div className="product-name">{item.name}</div>
              <div className="product-price">${item.price}</div>
              <div className="product-quantity">Quantity: {item.quantity}</div>
            </div>
          ))
        ) : (
          <div className="no-products">No products available</div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
