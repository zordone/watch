import React from 'react';
import './Loader.css';

const Loader = () => (
    <div className="Loader">
        <div className="Loader-center">
            <div className="Loader-image Loader-bg" />
            <div className="Loader-image Loader-fg" />
        </div>
    </div>
);

export default Loader;
