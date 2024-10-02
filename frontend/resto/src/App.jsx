import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";

import { useState } from "react";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import OrderSummary from "./pages/OrderSummary/OrderSummary";
import ReviewModal from "./components/ReviewModal/ReviewModal";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false); // State to control review modal
  const [selectedMenuItemId, setSelectedMenuItemId] = useState(null); // State to store the menuItemId for review

  // Function to open the review modal with a specific menuItemId
  const openReviewModal = (menuItemId) => {
    setSelectedMenuItemId(menuItemId);
    setShowReviewModal(true);
  };

  // Function to close the review modal
  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedMenuItemId(null);
  };

  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route
            path="/"
            element={<Home openReviewModal={openReviewModal} />}
          />
          <Route
            path="/Cart"
            element={<Cart openReviewModal={openReviewModal} />}
          />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/order-summary" element={<OrderSummary />} />
        </Routes>
      </div>
      <Footer />

      {/* Render ReviewModal if the modal should be open */}
      {showReviewModal && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={closeReviewModal}
          menuItemId={selectedMenuItemId} // Pass the selected menu item ID
        />
      )}
    </>
  );
};

export default App;
