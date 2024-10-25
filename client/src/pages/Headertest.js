import React, { useState } from 'react';
import './hd.css';

const Header = () => {
  const [isActive, setIsActive] = useState(false);

  const handleSearchClick = () => {
    setIsActive(!isActive);
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar__logo">
          Logo
        </div>
        <nav className="navbar__nav">
          <ul>
            <li><a href="#">Store</a></li>
            <li><a href="#">Backpack</a></li>
            <li><a href="#">Apparel</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </nav>
        <div className="navbar__actions">
          <button
            className={`search-button ${isActive ? 'active' : ''}`}
            onClick={handleSearchClick}
          >
            Search
          </button>
          <button className="cart-button">
            Cart
          </button>
          <button className="profile-button">
            Profile
          </button>
        </div>
      </header>
      <div className={`search-input-container ${isActive ? 'active' : ''}`}>
        <input
          type="text"
          className={`search-input ${isActive ? 'active' : ''}`}
          placeholder="Search..."
        />
      </div>
    </>
  );
};

export default Header;
