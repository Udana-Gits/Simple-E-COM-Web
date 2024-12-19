import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom"; // Import useNavigate to navigate between pages
import "../CSS/AdminPage.css";

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // State to store selected category
  const navigate = useNavigate(); // Hook to navigate

  useEffect(() => {
    // Fetch inventory from Firebase
    const db = getDatabase();
    const productsRef = ref(db, "products");

    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productsArray = Object.values(data);
        setProducts(productsArray);
        setFilteredProducts(productsArray);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sorting Algorithms
  const quickSort = (arr) => {
    if (arr.length <= 1) return arr;
    const pivot = arr[0];
    const left = arr.slice(1).filter((item) => parseFloat(item.price) > parseFloat(pivot.price));
    const right = arr.slice(1).filter((item) => parseFloat(item.price) <= parseFloat(pivot.price));
    return [...quickSort(left), pivot, ...quickSort(right)];
  };

  const mergeSort = (arr) => {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    const merged = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
      if (left[i].name.toLowerCase() <= right[j].name.toLowerCase()) {
        merged.push(left[i++]);
      } else {
        merged.push(right[j++]);
      }
    }
    return [...merged, ...left.slice(i), ...right.slice(j)];
  };

  const shellSort = (arr) => {
    const n = arr.length;
    let gap = Math.floor(n / 2);

    while (gap > 0) {
      for (let i = gap; i < n; i++) {
        const temp = arr[i];
        let j = i;
        while (j >= gap && parseInt(arr[j - gap].quantity) > parseInt(temp.quantity)) {
          arr[j] = arr[j - gap];
          j -= gap;
        }
        arr[j] = temp;
      }
      gap = Math.floor(gap / 2);
    }
    return arr;
  };

  // Recursive Search
  const searchProducts = (term) => {
    const lowerTerm = term.toLowerCase();
    const filtered = products.filter(
      (item) => item.id.toLowerCase().includes(lowerTerm) || item.name.toLowerCase().includes(lowerTerm)
    );
    setFilteredProducts(filtered);
  };

  // Filter products by selected category
  const filterByCategory = (category) => {
    setSelectedCategory(category);
    const filtered = products.filter((item) => item.category === category);
    setFilteredProducts(filtered);
  };

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <div className="top-bar">
        <button
          onClick={() => navigate("/visualization")} // Navigate to visualization page
          className="visualization-button"
        >
          Visualization
        </button>
        <button onClick={() => navigate("/adduser")} className="add-user-button">Add User</button>
      </div>

      <div className="category-buttons">
        <button onClick={() => filterByCategory("Sports")} className="category-button">
          sports
        </button>
        <button onClick={() => filterByCategory("Beauty")} className="category-button">
          Beauty
        </button>
        <button onClick={() => filterByCategory("Electronics")} className="category-button">
          Electronics
        </button>
        <button onClick={() => filterByCategory("Fashion")} className="category-button">
          Fashion
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Name or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button onClick={() => searchProducts(searchTerm)} className="search-button">
          Search
        </button>
        <button onClick={() => setFilteredProducts(products)} className="view-all-button">
          View All Products
        </button>
      </div>

      <div className="sort-buttons">
        <button onClick={() => setFilteredProducts(quickSort([...filteredProducts]))}>
          Sort by Price (Descending)
        </button>
        <button onClick={() => setFilteredProducts(mergeSort([...filteredProducts]))}>
          Sort by Name (A-Z)
        </button>
        <button onClick={() => setFilteredProducts(shellSort([...filteredProducts]))}>
          Sort by Quantity (Ascending)
        </button>
      </div>

      <div className="product-list">
        <h2>Filtered Products</h2>
        <ul>
          {filteredProducts.map((product) => (
            <li key={product.id}>
              <span>{product.name}</span> - {product.category} - ${product.price} - {product.quantity} units
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;
