import { FaStar } from "react-icons/fa";
import "./Stars.css";
import { useState } from "react";

function Stars() {
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);

  return (
    <div className="stars">
      {[...Array(5)].map((star, index) => {
        const currentRating = index + 1; // Add index as the argument
        return (
          <label key={currentRating}>
            <input
              type="radio"
              name="rating"
              value={currentRating}
              onClick={() => setRating(currentRating)}
              style={{ display: "none" }} // Hide the radio button
            />
            <FaStar
              className="star"
              size={50}
              color={currentRating <= (hover || rating) ? "#ffc107" : "#e4e5e9"} // Fixed missing #
              onMouseEnter={() => setHover(currentRating)} // Fixed syntax
              onMouseLeave={() => setHover(null)} // Fixed syntax
            />
          </label>
        );
      })}
    </div>
  );
}

export default Stars;
