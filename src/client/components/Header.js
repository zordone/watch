import React from "react";
import PropTypes from "prop-types";
import { noop } from "../service/utils";
import "./Header.css";

const Header = ({
  searchField = null,
  helpButton = null,
  newButton = null,
  onLogoClick = noop,
}) => (
  <header className="Header">
    <div className="Header-logoAndTitle">
      <button type="button" className="Header-logoButton" onClick={onLogoClick}>
        <img className="Header-logo" alt="logo" src="/app-logo.webp" />
      </button>
      <img className="Header-title" alt="watch" src="/app-title.webp" />
    </div>
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

export default Header;
