import React from 'react';
import PropTypes from 'prop-types';
import './Header.css';

const Header = ({ searchField, newButton }) => (
    <header className="Header">
        <img className="Header-logo" alt="logo" src="/app-logo.webp" />
        <div className="Header-title" />
        {searchField}
        {newButton}
    </header>
);

Header.propTypes = {
    searchField: PropTypes.element,
    newButton: PropTypes.element
};

Header.defaultProps = {
    searchField: null,
    newButton: null
};

export default Header;
