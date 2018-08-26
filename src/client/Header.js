import React from 'react';
import PropTypes from 'prop-types';
import './Header.css';

const Header = ({ subtitle, children }) => (
    <header className="Header">
        <div className="Header-left">
            <h1 className="Header-title">
                Watch
            </h1>
            {Boolean(subtitle) && (
                <h2 className="Header-subtitle">
                    {subtitle}
                </h2>
            )}
        </div>
        <div className="Header-right">
            {children}
        </div>
    </header>
);

Header.propTypes = {
    subtitle: PropTypes.string,
    children: PropTypes.element
};

Header.defaultProps = {
    subtitle: '',
    children: null
};

export default Header;
