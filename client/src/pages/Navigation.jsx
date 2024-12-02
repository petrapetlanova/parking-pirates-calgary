import React from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";

const Navigation = () => {
  return (
    <nav className="nav-bar">
      <div className="logo">
        <img
          width="180px"
          src="../src/assets/pp-logo-reversed.svg"
          alt="logo"
        />
      </div>
      <div className="nav-links">
        <a href="#AboutUs">About Us</a>
        <a href="#ContactUs"> Contact Us</a>
        <Link to="/dashboard" className="sign-up-btn">
          Find Parking
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
