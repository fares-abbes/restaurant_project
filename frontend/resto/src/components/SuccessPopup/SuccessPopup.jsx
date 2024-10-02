// SuccessPopup.jsx

import PropTypes from "prop-types"; // Import PropTypes
import "./SuccessPopup.css"; // Ensure you have the CSS file

const SuccessPopup = ({ onClose, onSubmit }) => {
  return (
    <div className="success-popup-overlay">
      <div className="success-popup">
        <h2>Review Submitted</h2>
        <p>Your review has been submitted successfully!</p>
        <button onClick={onSubmit}>Submit Another Review</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

// Define prop types
SuccessPopup.propTypes = {
  onClose: PropTypes.func.isRequired, // onClose must be a function and is required
  onSubmit: PropTypes.func.isRequired, // onSubmit must be a function and is required
};

export default SuccessPopup;
