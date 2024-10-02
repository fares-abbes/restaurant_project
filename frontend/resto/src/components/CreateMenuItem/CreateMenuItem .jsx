import { useState } from "react";
import axios from "axios";
import "./CreateMenuItem.css";

const CreateMenuItem = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const menuItem = { name, description, price, imageUrl, categoryId };

    axios
      .post("http://localhost:8087/api/admin/menu-items", menuItem)
      .then(() => {
        alert("Menu item created successfully");
        setName("");
        setDescription("");
        setPrice("");
        setImageUrl("");
        setCategoryId("");
      })
      .catch((err) => alert(`Error: ${err.message}`));
  };

  const handleFileChange = (e) => {
    setImageUrl(e.target.files[0]);
  };

  return (
    <div className="create-menu-item">
      <h2>Create Menu Item</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <div className="form-row">
          <div className="form-group">
            <label>Price:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Category:</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              <option value="1">Pasta</option>
              <option value="2">Pure Veg</option>
              <option value="3">Cake</option>
              <option value="4">Sandwich</option>
              <option value="5">Deserts</option>
              <option value="6">Rolls</option>
              <option value="7">Salad</option>
              <option value="8">Noodles</option>
            </select>
          </div>
        </div>

        <div className="file-upload-wrapper">
          <input type="file" id="imageUpload" onChange={handleFileChange} />
          <label htmlFor="imageUpload" className="custom-file-upload">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-camera"
              viewBox="0 0 16 16"
            >
              <path d="M10.5 6.5a.5.5 0 0 1 .5.5v1l.5 1 .5-1v-1a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-1l-.5 1-.5-1v1l.5 1 .5-1h1a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5v-1l-.5-1-.5 1v1a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5V8l-.5 1-.5-1v1l-.5 1 .5-1v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1l.5-1V8l-.5 1H2a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v1l.5 1 .5-1v-1h2a.5.5 0 0 1 0-1h-2a.5.5 0 0 1-.5-.5v-1h-.5a.5.5 0 0 1 0-1H8.5V4a.5.5 0 0 1 1 0v1h1a.5.5 0 0 1 .5.5v1H10.5v-.5z" />
            </svg>
            Select Photo
          </label>
          <span className="file-upload-name">
            {imageUrl ? imageUrl.name : "No file chosen"}
          </span>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateMenuItem;
