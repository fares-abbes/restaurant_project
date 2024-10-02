// src/components/DeleteMenuItem.js
import { useState } from "react";
import axios from "axios";
import "./DeleteMenuItem.css";

const DeleteMenuItem = () => {
  const [menuItemId, setMenuItemId] = useState("");

  const handleDelete = () => {
    axios
      .delete(`http://localhost:8084/api/menu-items/${menuItemId}`)
      .then(() => {
        alert("Menu item deleted successfully");
        setMenuItemId("");
      })
      .catch((err) => alert(`Error: ${err.message}`));
  };

  return (
    <div className="delete-menu-item">
      <h2>Delete Menu Item</h2>
      <label>Menu Item ID:</label>
      <input
        type="number"
        value={menuItemId}
        onChange={(e) => setMenuItemId(e.target.value)}
        required
      />
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default DeleteMenuItem;
