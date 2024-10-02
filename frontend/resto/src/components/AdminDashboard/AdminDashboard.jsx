import { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);

  // Fetch metrics for today
  useEffect(() => {
    axios
      .get("http://localhost:8087/api/admin/metrics/today")
      .then((response) => {
        setMetrics(response.data);
      })
      .catch((error) => {
        console.error("Error fetching metrics:", error);
      });
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <section className="metrics-section">
        <h2>Todays Metrics</h2>
        {metrics ? (
          <div>
            <p>Total Income: {metrics.totalIncome}</p>
            <p>Total Orders: {metrics.totalOrders}</p>
            <h3>Rating Percentages:</h3>
            <ul>
              {Object.entries(metrics.ratingPercentages).map(
                ([rating, percentage]) => (
                  <li key={rating}>
                    {rating} Stars: {percentage}%
                  </li>
                )
              )}
            </ul>
            <div className="table-wrapper">
              <h3>Menu Items Ranked by Sales:</h3>
              <table className="sales-table">
                <thead>
                  <tr>
                    <th>Menu Item</th>
                    <th>Quantity Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.menuItemsRankedBySales.map((item) => (
                    <tr key={item.menuItemId}>
                      <td>{item.menuItemName}</td>
                      <td>{item.quantitySold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="loading-message">Loading metrics...</p>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
