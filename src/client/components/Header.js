import React from "react";
import PropTypes from "prop-types";
import "./Header.css";

const Header = ({ searchField, helpButton, newButton }) => (
  <header className="Header">
    <img className="Header-logo" alt="logo" src="/app-logo.webp" />
    <div className="Header-title" />
    {searchField}
    {helpButton}
    {newButton}
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
