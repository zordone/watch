import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';

const SelectField = ({ options, ...props }) => (
    <TextField
        select
        {...props}
        SelectProps={{ native: true }}
    >
        {options.map(option => (
            <option key={option} value={option}>
                {option}
            </option>
        ))}
    </TextField>
);

SelectField.propTypes = {
    id: PropTypes.string,
    style: PropTypes.shape({}),
    label: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.string)
};

SelectField.defaultProps = {
    id: undefined,
    style: {},
    label: undefined,
    onChange: () => {},
    options: ''
};

export default SelectField;
