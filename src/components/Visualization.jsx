import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import Chart from "chart.js/auto";
import * as XLSX from "xlsx"; // Import xlsx library
import { useNavigate } from "react-router-dom";
import "../CSS/Visualization.css";

let chartInstance = null; // Store chart instance globally

const Visualization = () => {
  const [products, setProducts] = useState([]);
  const [chartType, setChartType] = useState("bar");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch inventory from Firebase
    const db = getDatabase();
    const productsRef = ref(db, "products");

    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productsArray = Object.values(data);
        setProducts(productsArray);
      }
    });

    return () => unsubscribe();
  }, []);

  // Function to render the chart
  const renderChart = () => {
    const ctx = document.getElementById("inventoryChart").getContext("2d");

    // Destroy the previous chart if it exists
    if (chartInstance) {
      chartInstance.destroy();
    }

    const categories = [...new Set(products.map((product) => product.category))];
    const data = categories.map((category) =>
      products.reduce(
        (total, product) =>
          product.category === category ? total + parseInt(product.quantity) : total,
        0
      )
    );

    // Create a new chart
    chartInstance = new Chart(ctx, {
      type: chartType,
      data: {
        labels: categories,
        datasets: [
          {
            label: "Quantity Distribution by Category",
            data,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      },
    });
  };

  // Function to generate Excel report
  const generateReport = () => {
    const worksheet = XLSX.utils.json_to_sheet(products);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    // Generate file and download it
    XLSX.writeFile(workbook, "product_report.xlsx");
  };

  // Handle Calculate button click
  const handleCalculateClick = () => {
    navigate("/calculate");
  };

  return (
    <div className="visualization-page">
      <h1>Visualization Dashboard</h1>
      <div className="button-container">
        <button onClick={generateReport} className="report-button">
          Generate Report
        </button>
        <button onClick={handleCalculateClick} className="calculate-button">
          Calculate
        </button>
      </div>

      <div className="canvas-container">
        <select onChange={(e) => setChartType(e.target.value)} className="chart-select">
          <option value="bar">Bar Chart</option>
          <option value="pie">Pie Chart</option>
        </select>
        <button onClick={renderChart} className="chart-button">
          Render Chart
        </button>
        {/* Adjust the size of the chart */}
        <div className="chart-wrapper">
          <canvas id="inventoryChart"></canvas>
        </div>
      </div>
    </div>
  );
};

export default Visualization;
