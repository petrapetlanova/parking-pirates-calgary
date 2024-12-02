import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import AboutUs from "./AboutUs";
import ContactUs from "./ContactUs";
import Navigation from "./Navigation";

const Home = () => {
  return (
    <div className="font-poppins">
      <nav className="sticky top-0 z-50">
        <Navigation />
      </nav>

      <div className="home-container">
        <div className="hero-section">
          <img
            className="hero-image"
            src="../src/assets/pp-logo-hero.svg"
            alt="logo"
          />
          <h2 className="subtitle">Find Calgary Parking Effortlessly</h2>
          <p className="description">
            Save time and reduce stress with parking availability and seamless
            navigation.
          </p>
          <Link to="/dashboard" className="cta-button">
            Find Parking Now
          </Link>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <img
              src="/src/assets/search.png"
              alt="Smart Location Search"
              className="icon-image"
            />
            <h3>Location Search</h3>
            <p>
              Find the closest parking spots to maximize efficiency and minimize
              frustration.
            </p>
          </div>

          <div className="feature-card">
            <img
              src="/src/assets/navigate.png"
              alt="Smart Location Search"
              className="icon-image"
            />
            <h3>Seemless Navigation</h3>
            <p>Turn-by-turn directions to your chosen parking spot.</p>
          </div>

          <div className="feature-card">
            <img
              src="/src/assets/filter.png"
              alt="Smart Location Search"
              className="icon-image"
            />
            <h3>Effective Filtering</h3>
            <p>Find the best parking rates in your desired location.</p>
          </div>
        </div>

        <section id="AboutUs">
          <AboutUs />
        </section>

        <section id="ContactUs">
          <ContactUs />
        </section>

        <footer id="CopyRight">
          <p>🦜 © 2024 Calgary Parking Pirates. All Rights Reserved. 🦜</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
