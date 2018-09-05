import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ChipInput from 'material-ui-chip-input';
import Autosuggest from 'react-autosuggest';
import { MenuItem, withStyles } from '@material-ui/core';

const chipInputStyles = {
    chipContainer: {
        minHeight: 'unset',
        // without the important, a `.chipContainer.labeled` class overrides this to 18.
        marginTop: '16px !important',
        display: 'inline-flex',
        whiteSpace: 'nowrap',
        overflow: 'scroll hidden'
    },
    chip: {
        height: '26px'
    },
    label: {
        top: 0
    }
};

const ChipInputWithStyles = withStyles(chipInputStyles)(ChipInput);

const autoSuggestTheme = {
    container: {
        position: 'relative',
        height: '48px'
    },
    input: {
        width: '100%',
        height: '100%'
    },
    suggestionsContainer: {
        position: 'absolute',
        zIndex: 1,
        top: '100%',
        width: '100%',
        backgroundColor: '#515151',
        boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
        boxSizing: 'border-box',
        borderRadius: '0 0 4px 4px'
    },
    suggestionsContainerOpen: {
        padding: '4px'
    },
    suggestionsList: {
        display: 'block',
        margin: 0,
        padding: 0
    },
    suggestion: {
        display: 'block'
    }
};

const suggestionMenuItemStyle = {
    padding: '0.2rem',
    borderRadius: '4px',
    color: '#FFF4'
};

const suggestionMenuItemStyleHighlighted = {
    color: '#FFF',
    background: '#FFF2'
};

class ChipInputAutoComplete extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            suggestions: [],
            inputValue: ''
        };
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onTryToAdd = this.onTryToAdd.bind(this);
        this.renderInputComponent = this.renderInputComponent.bind(this);
        this.renderSuggestion = this.renderSuggestion.bind(this);
    }

    onSuggestionsFetchRequested(options) {
        const { dataSource, value, maxChips } = this.props;
        const prefix = options.value.toLowerCase();
        this.setState({
            suggestions: dataSource.filter(item => (
                item.toLowerCase().startsWith(prefix) &&
                !value.includes(item) &&
                value.length < maxChips
            ))
        });
    }

    onSuggestionsClearRequested() {
        this.setState({
            suggestions: [],
            inputValue: ''
        });
    }

    onSuggestionSelected(e, { suggestionValue }) {
        const { onAdd } = this.props;
        onAdd(suggestionValue);
        e.preventDefault();
    }

    onInputChange(event, { newValue }) {
        this.setState({
            inputValue: newValue
        });
    }

    onTryToAdd(value) {
        const { dataSource, onAdd } = this.props;
        if (dataSource.includes(value)) {
            onAdd(value);
        } else {
            this.setState({
                inputValue: ''
            });
        }
    }

    renderInputComponent(inputProps) {
        const { chips, value, onChange, className, classes, dataSource, ...rest } = inputProps;
        return (
            <ChipInputWithStyles
                value={chips}
                onAdd={this.onAddGenre}
                onDelete={this.onDeleteGenre}
                onUpdateInput={onChange}
                className={`GenreField ${className}`}
                clearInputValueOnChange
                {...rest}
            />
        );
    }

    renderSuggestion(suggestion, { isHighlighted }) {
        return (
            <MenuItem
                component="div"
                selected={isHighlighted}
                style={{
                    ...suggestionMenuItemStyle,
                    ...(isHighlighted ? suggestionMenuItemStyleHighlighted : {})
                }}
            >
                <div>{suggestion}</div>
            </MenuItem>
        );
    }

    render() {
        const { value, containerStyle, onDelete, label } = this.props;
        const { suggestions, inputValue } = this.state;
        return (
            <Autosuggest
                theme={{
                    ...autoSuggestTheme,
                    container: {
                        ...autoSuggestTheme.container,
                        ...containerStyle
                    }
                }}
                inputProps={{
                    value: inputValue,
                    chips: value,
                    onChange: this.onInputChange,
                    onAdd: this.onTryToAdd,
                    onDelete,
                    label
                }}
                suggestions={suggestions}
                getSuggestionValue={suggestion => suggestion}
                renderInputComponent={this.renderInputComponent}
                renderSuggestion={this.renderSuggestion}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                onSuggestionSelected={this.onSuggestionSelected}
                focusInputOnSuggestionClick
                highlightFirstSuggestion
            />
        );
    }
}

ChipInputAutoComplete.propTypes = {
    value: PropTypes.arrayOf(PropTypes.string).isRequired,
    dataSource: PropTypes.arrayOf(PropTypes.string),
    containerStyle: PropTypes.shape({}),
    maxChips: PropTypes.number,
    onAdd: PropTypes.func,
    onDelete: PropTypes.func
};

ChipInputAutoComplete.defaultProps = {
    dataSource: [],
    containerStyle: {},
    maxChips: 5,
    onAdd: () => {},
    onDelete: () => {}
};

export default ChipInputAutoComplete;
