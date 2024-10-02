import { assets } from "../../assets/assets";
import "./LoginPopup.css";
import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPopup = ({ setShowLogin }) => {
  const [curState, setCurState] = useState("Login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "", // Only used for registration
  });
  const [verificationCode, setVerificationCode] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVerificationChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const baseUrl = "http://localhost:8099/auth";

    console.log(`Current State: ${curState}`);
    console.log("Form Data:", formData);

    try {
      if (curState === "Login") {
        const response = await axios.post(`${baseUrl}/login`, {
          email: formData.email,
          password: formData.password,
        });

        console.log("Login response:", response.data);

        const { token, role } = response.data;

        // Store token and role in local storage
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        // Redirect based on role
        if (role === "ADMIN") {
          console.log("Redirecting to AdminDashboard");
          navigate("/admindashboard");
          setShowLogin(false);
        }
      } else if (curState === "Sign Up") {
        const response = await axios.post(`${baseUrl}/signup`, {
          email: formData.email,
          password: formData.password,
          username: formData.username,
        });
        console.log("Sign Up response:", response.data);
        setCurState("Verify");
      }
    } catch (error) {
      console.error(`${curState} failed:`, error);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    const baseUrl = "http://localhost:8099/auth";

    try {
      const response = await axios.post(`${baseUrl}/verify`, {
        email: formData.email,
        verificationCode: verificationCode,
      });
      console.log("Verification response:", response.data);
      console.log("Hiding login popup after verification");
      setShowLogin(false); // Ensure this updates the state correctly
    } catch (error) {
      console.error("Verification failed:", error);
    }
  };

  const handleResendVerification = async () => {
    const baseUrl = "http://localhost:8099/auth";

    try {
      const response = await axios.post(`${baseUrl}/resend`, null, {
        params: { email: formData.email },
      });
      console.log("Resend verification response:", response.data);
    } catch (error) {
      console.error("Resend verification failed:", error);
    }
  };

  return (
    <div className="login-popup">
      <form
        className="login-popup-container"
        onSubmit={
          curState === "Verify" ? handleVerificationSubmit : handleSubmit
        }
      >
        <div className="login-popup-title">
          <h2>{curState}</h2>
          <img
            onClick={() => {
              console.log("Closing login popup");
              setShowLogin(false); // Ensure this updates the state correctly
            }}
            src={assets.cross_icon}
            alt="Close"
          />
        </div>
        <div className="login-popup-inputs">
          {curState === "Sign Up" && (
            <input
              type="text"
              name="username"
              value={formData.username}
              placeholder="Your username"
              required
              onChange={handleChange}
            />
          )}
          {curState === "Verify" ? (
            <input
              type="text"
              name="verificationCode"
              value={verificationCode}
              placeholder="Verification Code"
              required
              onChange={handleVerificationChange}
            />
          ) : (
            <>
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="Your email"
                required
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                placeholder="Password"
                required
                onChange={handleChange}
              />
            </>
          )}
        </div>
        <button type="submit">
          {curState === "Sign Up"
            ? "Create account"
            : curState === "Verify"
            ? "Verify"
            : "Login"}
        </button>
        <div className="login-popup-condition">
          {curState !== "Verify" && (
            <>
              <input type="checkbox" required />
              <p>
                By continuing, I agree to the terms of use & privacy policy.
              </p>
            </>
          )}
        </div>
        {curState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurState("Sign Up")}>Click here</span>
          </p>
        ) : curState === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurState("Login")}>Login here</span>
          </p>
        ) : (
          <p>
            Didn’t receive the code?{" "}
            <span onClick={handleResendVerification}>Resend</span>
          </p>
        )}
      </form>
    </div>
  );
};

LoginPopup.propTypes = {
  setShowLogin: PropTypes.func.isRequired,
};

export default LoginPopup;
