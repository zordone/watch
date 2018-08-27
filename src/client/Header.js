import React from 'react';
import PropTypes from 'prop-types';
import './Header.css';

const Header = ({ searchField, newButton }) => (
    <header className="Header">
        <span className="Header-logo" role="img" aria-label="logo">🍿</span>
        <div className="Header-left">
            <h1 className="Header-title">Watch</h1>
            <h2 className="Header-subtitle">Movies and TV Shows</h2>
        </div>
        <div className="Header-right">
            {searchField}
            {newButton}
        </div>
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
