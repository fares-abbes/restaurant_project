import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import "./PlaceOrder.css";

const PlaceOrder = () => {
  const { cartItems, getTotalCartAmount, menuItems } = useContext(StoreContext);
  const navigate = useNavigate();
  const [deliveryInfo, setDeliveryInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    phone: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo({ ...deliveryInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8092/api/deliveries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...deliveryInfo,
          totalAmount: getTotalCartAmount() + 2,
          orderedItems: Object.keys(cartItems).map((itemId) => ({
            id: itemId,
            quantity: cartItems[itemId],
            name:
              menuItems.find((item) => item.id === itemId)?.name || "Unknown",
            price: menuItems.find((item) => item.id === itemId)?.price || 0,
          })),
        }),
      });

      if (response.ok) {
        const deliveryData = await response.json();

        // Log cartItems to check its contents before navigating
        console.log("Cart Items before navigation:", cartItems);

        navigate("/order-summary", {
          state: {
            deliveryInfo: deliveryData,
            totalAmount: getTotalCartAmount() + 2,
            orderedItems: deliveryData.orderedItems,
            cartItems: cartItems, // Passing cartItems along with the state
          },
        });
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
      }
    } catch (error) {
      console.error("Request failed", error);
    }
  };

  return (
    <form className="place-order" onSubmit={handleSubmit}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={deliveryInfo.firstName}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={deliveryInfo.lastName}
            onChange={handleInputChange}
          />
        </div>
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={deliveryInfo.email}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="street"
          placeholder="Street"
          value={deliveryInfo.street}
          onChange={handleInputChange}
        />
        <div className="multi-fields">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={deliveryInfo.city}
            onChange={handleInputChange}
          />
        </div>
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={deliveryInfo.phone}
          onChange={handleInputChange}
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount().toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>$2.00</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${(getTotalCartAmount() + 2).toFixed(2)}</b>
            </div>
          </div>
          <button type="submit" className="checkout-button">
            Place Order
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
