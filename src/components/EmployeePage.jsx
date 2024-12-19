import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import '../CSS/EmployeePage.css'; // Import CSS file

const EmployeePage = () => {
  const navigate = useNavigate(); // Initialize navigate

  // Function to navigate to AddProduct page
  const goToAddProduct = () => {
    navigate('/add');
  };

  // Function to navigate to EditProduct page
  const goToEditProduct = () => {
    navigate('/editproduct');
  };

  return (
    <div className="employee-page-container">
      <h1>Employee Dashboard</h1>
      <div className="button-container">
        <button className="add-product" onClick={goToAddProduct}>Add Product</button>
        <button className="edit-product" onClick={goToEditProduct}>Edit Product</button>
      </div>
    </div>
  );
};

export default EmployeePage;
