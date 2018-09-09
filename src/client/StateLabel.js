import React from 'react';
import PropTypes from 'prop-types';
import { StateType } from '../common/enums';
import './StateLabel.css';

const StateLabel = ({ state, className }) => {
    if (!state) {
        return null;
    }
    return (
        <div className={`StateLabel StateLabel-${state.type} ${className}`}>
            {state.children || state.message}
        </div>
    );
};

StateLabel.propTypes = {
    state: PropTypes.shape({
        type: PropTypes.oneOf(Object.values(StateType)).isRequired,
        message: PropTypes.string.isRequired
    }),
    className: PropTypes.string
};

StateLabel.defaultProps = {
    state: null,
    className: ''
};

export default StateLabel;
