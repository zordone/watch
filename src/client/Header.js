import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ subtitle }) => (
    <header className="App-header">
        <h1 className="App-title">
            Watch
        </h1>
        {Boolean(subtitle) && (
            <h2 className="App-subtitle">
                {subtitle}
            </h2>
        )}
    </header>
);

Header.propTypes = {
    subtitle: PropTypes.string
};

Header.defaultProps = {
    subtitle: ''
};

export default Header;
