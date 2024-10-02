import { useState } from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported
import "./ReviewModal.css"; // Include custom CSS for additional styling

const ReviewModal = ({ isOpen, onClose, menuItemId }) => {
  const [userName, setUserName] = useState("Anonymous");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);

  const submitReview = async () => {
    if (rating < 1 || rating > 5) {
      setError("Rating must be between 1 and 5.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8086/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          menuItemId,
          userName,
          comment,
          rating,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong.");
      }

      onClose(); // Close the modal after successful submission
    } catch (error) {
      setError(error.message || "An error occurred. Please try again.");
    }
  };

  if (!isOpen) return null; // Return null if the modal is not open

  return (
    <div className="review-modal-overlay">
      <div className="review-modal-content">
        <button className="review-modal-close btn btn-link" onClick={onClose}>
          ×
        </button>
        <h2 className="text-center">{isOpen ? "Leave a Review" : ""}</h2>

        {error && <p className="text-danger">{error}</p>}

        <form>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username:
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="rating" className="form-label">
              Rating:
            </label>
            <input
              type="number"
              className="form-control"
              id="rating"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="comment" className="form-label">
              Comment:
            </label>
            <textarea
              className="form-control"
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>

          <div className="text-center">
            <button
              type="button"
              className="btn btn-primary"
              onClick={submitReview}
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ReviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  menuItemId: PropTypes.number.isRequired,
};

export default ReviewModal;
