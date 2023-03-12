import React from "react";
import PropTypes from "prop-types";
import "./Header.css";

const Header = ({ searchField, helpButton, newButton, onLogoClick }) => (
  <header className="Header">
    <button type="button" className="Header-logoButton" onClick={onLogoClick}>
      <img className="Header-logo" alt="logo" src="/app-logo.webp" />
    </button>
    <img className="Header-title" alt="watch" src="/app-title.webp" />
    {searchField}
    <div className="Header-buttons">
      {helpButton}
      {newButton}
    </div>
  </header>
);

Header.propTypes = {
  searchField: PropTypes.element,
  helpButton: PropTypes.element,
  newButton: PropTypes.element,
  onLogoClick: PropTypes.func,
};

Header.defaultProps = {
  searchField: null,
  helpButton: null,
  newButton: null,
  onLogoClick: () => {},
};

export default Header;
