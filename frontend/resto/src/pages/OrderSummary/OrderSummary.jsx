import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext"; // Assuming this is where your context is
import ReviewModal from "../../components/ReviewModal/ReviewModal";
import "./OrderSummary.css"; // Include CSS for styling

const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setCartItems } = useContext(StoreContext); // Assuming you have a setter for cartItems in the context

  const [menuItemsDetails, setMenuItemsDetails] = useState([]);
  const [averageRatings, setAverageRatings] = useState({});
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    cartItems = {},
    totalAmount = 0,
    deliveryInfo = {},
  } = location.state || {};

  const fetchMenuItemDetails = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8084/api/menu-items/${id}`
      );
      if (response.ok) {
        return await response.json();
      } else {
        console.error("Failed to fetch menu item details");
        return null;
      }
    } catch (error) {
      console.error("Error fetching menu item details:", error);
      return null;
    }
  };

  const fetchAverageRating = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8086/api/reviews/average-rating/${id}`
      );
      if (response.ok) {
        return await response.json();
      } else {
        console.error("Failed to fetch average rating");
        return null;
      }
    } catch (error) {
      console.error("Error fetching average rating:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchAllMenuItems = async () => {
      const promises = Object.keys(cartItems).map((id) =>
        fetchMenuItemDetails(id)
      );
      const items = await Promise.all(promises);
      setMenuItemsDetails(items.filter((item) => item !== null));
    };

    const fetchAllRatings = async () => {
      const ratings = {};
      const promises = Object.keys(cartItems).map(async (id) => {
        const rating = await fetchAverageRating(id);
        if (rating !== null) {
          ratings[id] = rating;
        }
      });
      await Promise.all(promises);
      setAverageRatings(ratings);
    };

    fetchAllMenuItems();
    fetchAllRatings();
  }, [cartItems]);

  const getCartItemsDetails = () => {
    return menuItemsDetails
      .filter((item) => cartItems[item.id] > 0)
      .map((item) => ({
        ...item,
        quantity: cartItems[item.id],
        total: item.price * cartItems[item.id],
        rating: averageRatings[item.id] || "N/A", // Use the fetched average rating
      }));
  };

  const cartItemsDetails = getCartItemsDetails();

  // Handle going back to home and clearing the cart
  const handleGoBack = () => {
    setCartItems({}); // Clear the cart in the StoreContext
    navigate("/"); // Navigate back to the home page
  };

  return (
    <div className="order-summary-container">
      <div className="order-confirmation">Your order is confirmed</div>
      <div className="order-items">
        <h2>Items Bought</h2>
        <div className="order-items-title">
          <p>Image</p>
          <p>Name</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Average Rating</p> {/* Updated to reflect average rating */}
          <p>Action</p>
        </div>
        <br />
        <hr />
        {cartItemsDetails.length ? (
          cartItemsDetails.map((item) => (
            <div className="order-items-item" key={item.id}>
              <img
                className="order-item-image"
                src={item.imageUrl}
                alt={item.name}
              />
              <p>{item.name}</p>
              <p>${item.price}</p>
              <p>{item.quantity}</p>
              <p>${item.total.toFixed(2)}</p>
              <p>{item.rating}</p> {/* Display the average rating */}
              <button
                onClick={() => {
                  console.log("Review button clicked for item ID:", item.id); // Log the item ID
                  setSelectedMenuItem(item.id);
                  setIsModalOpen(true);
                }}
              >
                Review
              </button>
            </div>
          ))
        ) : (
          <p>No items found</p>
        )}
      </div>
      <div className="order-summary-totals">
        <div className="summary-items">
          <h2>Order Summary</h2>
          <div className="summary-details">
            <p>
              <strong>First Name:</strong> {deliveryInfo.firstName || "N/A"}
            </p>
            <p>
              <strong>Last Name:</strong> {deliveryInfo.lastName || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {deliveryInfo.email || "N/A"}
            </p>
            <p>
              <strong>Street:</strong> {deliveryInfo.street || "N/A"}
            </p>
            <p>
              <strong>City:</strong> {deliveryInfo.city || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {deliveryInfo.phone || "N/A"}
            </p>
          </div>
        </div>
        <div className="order-total">
          <h2>Order Totals</h2>
          <div>
            <div className="order-total-details">
              <p>Subtotal</p>
              <p>${totalAmount.toFixed(2)}</p>
            </div>
            <hr />
            <div className="order-total-details">
              <p>Delivery Fee</p>
              <p>$2.00</p>
            </div>
            <hr />
            <div className="order-total-details">
              <b>Total</b>
              <b>${(totalAmount + 2).toFixed(2)}</b>
            </div>
          </div>
        </div>
      </div>
      <div className="go-back-button-container">
        <button className="go-back-button" onClick={handleGoBack}>
          Go Back to Home
        </button>
      </div>
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => {
          console.log("Modal closed, selected menuItemId:", selectedMenuItem); // Log the menuItemId when modal closes
          setIsModalOpen(false);
        }}
        menuItemId={selectedMenuItem}
      />
    </div>
  );
};

export default OrderSummary;
