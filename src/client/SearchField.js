import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField, InputAdornment } from '@material-ui/core';
import _ from 'lodash';
import './SearchField.css';

class SearchField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
        const { onChange } = props;
        this.onChangeDebounced = _.debounce(value => onChange(value), 200);
        this.onFieldChange = this.onFieldChange.bind(this);
    }

    onFieldChange(event) {
        const { value } = event.target;
        this.onChangeDebounced(value);
        this.setState({ value });
    }

    render() {
        const { value } = this.state;
        const emptyClass = value ? 'not-empty' : 'empty';
        return (
            <div className={`SearchField ${emptyClass}`}>
                <TextField
                    placeholder="Search"
                    value={value}
                    onChange={this.onFieldChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <i className="material-icons">search</i>
                            </InputAdornment>
                        ),
                        style: {
                            fontSize: '1.5rem'
                        },
                        disableUnderline: true,
                        classes: {
                            root: 'SearchField-input',
                            focused: 'focused'
                        }
                    }}
                    fullWidth
                />
            </div>
        );
    }
}

SearchField.propTypes = {
    onChange: PropTypes.func
};

SearchField.defaultProps = {
    onChange: () => {}
};

export default SearchField;
