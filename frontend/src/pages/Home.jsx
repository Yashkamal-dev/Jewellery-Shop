import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">

          <p className="hero-small-title">
            ELEGANCE • BEAUTY • STYLE
          </p>

          <h1>
            Discover Your Perfect Jewellery
          </h1>

          <p className="hero-description">
            Explore our beautiful collection of jewellery
            designed to make every moment special.
          </p>

          <Link to="/products" className="hero-button">
            Shop Now
          </Link>

        </div>
      </section>
    </div>
  );
}

export default Home;