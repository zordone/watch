import React from "react";
import PropTypes from "prop-types";
import "./Header.css";

const Header = ({ searchField, helpButton, newButton }) => (
  <header className="Header">
    <img className="Header-logo" alt="logo" src="/app-logo.webp" />
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
};

Header.defaultProps = {
  searchField: null,
  helpButton: null,
  newButton: null,
};

export default Header;
