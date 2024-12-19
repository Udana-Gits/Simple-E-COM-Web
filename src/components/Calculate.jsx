import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database"; // Import Firebase methods
import "../CSS/Calculate.css";

const Calculate = () => {
  const [totalValue, setTotalValue] = useState(0);
  const [products, setProducts] = useState([]);
  
  // Recursive function to calculate total value
  const calculateTotalValueRecursive = (filteredProducts, index = 0, total = 0) => {
    if (index >= filteredProducts.length) {
      return total;
    }

    const product = filteredProducts[index];
    // Convert price and quantity to integers for correct calculation
    const productTotal = parseInt(product.price) * parseInt(product.quantity);
    return calculateTotalValueRecursive(filteredProducts, index + 1, total + productTotal);
  };

  // Fetch products from Firebase
  const fetchProducts = () => {
    const db = getDatabase();
    const productsRef = ref(db, 'products'); // Assuming data is under "products" node in Firebase

    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProducts(Object.values(data)); // Set the products data into state
      } else {
        setProducts([]); // Clear products if no data exists
      }
    });

    return () => unsubscribe(); // Cleanup listener
  };

  // Calculate total value by category or all products
  const calculateTotalValue = (category) => {
    const filteredProducts =
      category === "all" ? products : products.filter((product) => product.category === category);

    // Use the recursive function to calculate total
    const total = calculateTotalValueRecursive(filteredProducts);
    setTotalValue(total);
  };

  useEffect(() => {
    // Fetch products when the component mounts
    fetchProducts();
  }, []);

  return (
    <div className="calculate-page">
      <h1>Product Category Calculation</h1>
      <div className="category-buttons">
        <button onClick={() => calculateTotalValue("Electronics")}>Electronics</button>
        <button onClick={() => calculateTotalValue("Fashion")}>Fashion</button>
        <button onClick={() => calculateTotalValue("Beauty")}>Beauty</button>
        <button onClick={() => calculateTotalValue("Sports")}>Sports</button>
        <button onClick={() => calculateTotalValue("all")}>All Products</button>
      </div>
      <div className="total-value">
        <h3>Total Value: ${totalValue}</h3>
      </div>
    </div>
  );
};

export default Calculate;
