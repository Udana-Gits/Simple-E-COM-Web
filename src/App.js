import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddProduct from './components/AddProduct';
import SearchResults from './components/SearchResults';
import ProductGrid from './components/ProductGrid';
import ProductDetails from './components/ProductDetails';
import LoginPage from './components/login'; // Correct component name
import StaffLoginPage from './components/stafflogin';
import ERoleSelectionPage from './components/RoleSelectionPage';
import EAdminPage from './components/AdminPage';
import EEmployeePage from './components/EmployeePage';
import EEditProduct from './components/EditProduct';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import './components/Firebase'; // Ensure Firebase is initialized in this file
import Header from './components/Header'; // Import Header only here
import Visualization from "./components/Visualization";
import EAddUser from "./components/AddUser";
import Calculate from "./components/Calculate";


const App = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const inventoryRef = ref(db, 'inventory');

    // Fetch inventory from Firebase
    const unsubscribe = onValue(inventoryRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setInventory(Object.values(data));
      } else {
        setInventory([]); // Clear inventory if no data exists
      }
    });

    return () => unsubscribe(); // Clean up listener on component unmount
  }, []);

  const handleAddProduct = (newProduct) => {
    const db = getDatabase();
    const inventoryRef = ref(db, `inventory/${newProduct.id}`);
    set(inventoryRef, newProduct);
  };

  return (
    <Router>
      <Routes>
        {/* Only include Header in ProductGrid route */}
        <Route
          path="/"
          element={
            <>
              <Header setSearchResults={setSearchResults} inventory={inventory} />
              <ProductGrid inventory={inventory} />
            </>
          }
        />
        <Route
          path="/add"
          element={<AddProduct onAddProduct={handleAddProduct} />}
        />
        <Route
          path="/login"
          element={<LoginPage />} // Corrected here
        />
        <Route path="/roleselection" element={<ERoleSelectionPage />} />
        <Route
          path="/stafflogin"
          element={<StaffLoginPage />} // Corrected here
        />
        <Route path="/adminpage" element={<EAdminPage />} />
        <Route path="/employeepage" element={<EEmployeePage />} />
        <Route path="/editproduct" element={<EEditProduct />} />
        <Route path="/visualization" element={<Visualization />} />
        <Route path="/calculate" element={<Calculate />} />
        <Route path="/adduser" element={<EAddUser />} />
        <Route
          path="/search"
          element={<SearchResults searchResults={searchResults} />}
        />
        <Route
          path="/product/:id"
          element={<ProductDetails inventory={inventory} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
