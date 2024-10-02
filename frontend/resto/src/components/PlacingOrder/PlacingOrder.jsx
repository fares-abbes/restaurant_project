import { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";

const OrderButton = () => {
  const { cartItems } = useContext(StoreContext);

  const handleOrder = async () => {
    try {
      const orderItems = Object.keys(cartItems).map((id) => ({
        menuItemId: id,
        quantity: cartItems[id],
      }));

      const response = await fetch("http://localhost:8085/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: orderItems }),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      const result = await response.json();
      console.log("Order placed successfully:", result);

      // Optionally, clear the cart or redirect the user
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return <button onClick={handleOrder}>Proceed To Payment</button>;
};

export default OrderButton;
