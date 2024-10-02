import { useContext, useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import "./FoodItem.css";
import PropTypes from "prop-types";
import { StoreContext } from "../../Context/StoreContext";
import { FaStar } from "react-icons/fa";
import SuccessPopup from "../../components/SuccessPopup/SuccessPopup";

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [reviewError, setReviewError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const fetchAverageRating = async () => {
    try {
      const response = await fetch(
        `http://localhost:8086/api/reviews/average-rating/${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setRating(data ? data.toFixed(1) : null);
      } else {
        console.error("Failed to fetch average rating");
      }
    } catch (error) {
      console.error("Error fetching average rating:", error);
    }
  };

  const submitReview = async (newRating) => {
    try {
      const response = await fetch(`http://localhost:8086/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          menuItemId: id,
          userName: "Anonymous",
          comment: "",
          rating: newRating,
        }),
      });

      if (response.ok) {
        const data = await response.json().catch(() => null);
        if (data && data.averageRating) {
          setRating(data.averageRating.toFixed(1));
          setReviewError("");
          setShowPopup(true);
        } else {
          setReviewError("Review submitted successfully.");
        }
      } else {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || "Failed to submit review.";
        setReviewError(errorMessage);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setReviewError("An error occurred while submitting the review.");
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleSubmitReview = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    fetchAverageRating();
  }, [id]);

  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      const currentRating = index + 1;
      return (
        <FaStar
          key={index}
          size={20}
          color={
            currentRating <= (hover || userRating || rating)
              ? "tomato"
              : "#e4e5e9"
          }
          style={{ marginRight: "5px", cursor: "pointer" }}
          onClick={() => {
            setUserRating(currentRating);
            submitReview(currentRating);
          }}
          onMouseEnter={() => setHover(currentRating)}
          onMouseLeave={() => setHover(null)}
        />
      );
    });
  };

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img className="food-item-image" src={image} alt={name} />
        {!cartItems[id] ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt="Add"
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={() => removeFromCart(id)}
              src={assets.remove_icon_red}
              alt="Remove"
            />
            <p>{cartItems[id]}</p>
            <img
              onClick={() => addToCart(id)}
              src={assets.add_icon_green}
              alt="Add more"
            />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <div className="food-item-rating">
            {renderStars()}
            {rating !== null && (
              <span className="rating-average">{rating}</span>
            )}
          </div>
        </div>
        <p className="food-item-desc">{description}</p>
        <div className="food-item-details">
          <p className="food-item-price">${price}</p>
        </div>
      </div>
      {reviewError && <p style={{ color: "red" }}>{reviewError}</p>}
      {showPopup && (
        <SuccessPopup
          onClose={handleClosePopup}
          onSubmit={handleSubmitReview}
        />
      )}
    </div>
  );
};

FoodItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
};

export default FoodItem;
