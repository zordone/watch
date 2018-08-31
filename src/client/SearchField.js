/* globals document */

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
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    componentDidMount() {
        document.addEventListener('keyup', this.onKeyUp);
        document.addEventListener('keydown', this.onKeyDown);
    }

    componentWillReceiveProps(nextProps) {
        const { value: prevValue } = this.state;
        const { value: nextValue } = nextProps;
        if (prevValue !== nextValue) {
            this.setState({ value: nextValue });
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keyup', this.onKeyUp);
        document.removeEventListener('keydown', this.onKeyDown);
    }

    onFieldChange(event) {
        const { value } = event.target;
        this.onChangeDebounced(value);
        this.setState({ value });
    }

    onKeyUp(event) {
        if (event.code === 'KeyF') {
            this.inputRef.focus();
        } else if (event.code === 'Escape') {
            this.onFieldChange({ target: { value: '' } });
            this.inputRef.blur();
        }
    }

    onKeyDown(event) {
        const { onShortcut } = this.props;
        const inSearch = document.activeElement === this.inputRef;
        onShortcut(event.code, inSearch);
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
                    inputRef={ref => { this.inputRef = ref; }}
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
    onChange: PropTypes.func,
    onShortcut: PropTypes.func,
    value: PropTypes.string
};

SearchField.defaultProps = {
    onChange: () => {},
    onShortcut: () => {},
    value: ''
};

export default SearchField;
