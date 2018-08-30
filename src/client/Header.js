import React from 'react';
import PropTypes from 'prop-types';
import './Header.css';

const Header = ({ searchField, newButton }) => (
    <header className="Header">
        <img className="Header-logo" alt="logo" src="/app-logo.png" />
        <div className="Header-left">
            <div className="Header-title" />
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
