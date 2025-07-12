import React, { useState, useCallback, forwardRef } from "react";
import PropTypes from "prop-types";
import { MenuItem } from "@mui/material";
import { MuiChipsInput } from "mui-chips-input";
import Autosuggest from "react-autosuggest";
import { noop } from "../service/utils";
import "./ChipInputAutoComplete.css";

const autoSuggestTheme = {
  input: {
    width: "100%",
    height: "100%",
  },
  suggestionsContainer: {
    position: "absolute",
    zIndex: 2,
    top: "100%",
    width: "100%",
    backgroundColor: "#444444",
    boxShadow: "0px 4px 16px 0px #0006",
    boxSizing: "border-box",
    borderRadius: "0 0 4px 4px",
  },
  suggestionsContainerOpen: {
    padding: "8px",
    border: "2px solid #00a9ff",
    borderTop: "1px solid #00a9ff80",
  },
  suggestionsList: {
    display: "block",
    margin: 0,
    padding: 0,
  },
  suggestion: {
    display: "block",
  },
  suggestionHighlighted: {},
};

const suggestionMenuItemStyle = {
  padding: "0.4rem",
  borderRadius: "4px",
  color: "#FFF4",
};

const suggestionMenuItemStyleHighlighted = {
  color: "#FFF",
  background: "#FFF2",
};

const InputComponentWithRef = forwardRef(function InputComponent(inputProps, ref) {
  // we only destructure some of these to omit them from `rest`
  // eslint-disable-next-line no-unused-vars
  const { chips, value, onChange, classes, dataSource, ...rest } = inputProps;

  const onInputChangeConvert = useCallback(
    (newValue) => {
      // we don't get an event here, just the new value, but we need to pass an event-like object to keep Autosuggest happy
      const event = { target: { value: newValue } };
      onChange(event);
    },
    [onChange],
  );

  return (
    <MuiChipsInput
      inputRef={ref}
      value={chips}
      placeholder="Type..."
      onInputChange={onInputChangeConvert}
      clearInputOnBlur
      {...rest}
    />
  );
});

// we have to get the Autosuggest's ref and get if forwarded to the MuiChipsInput
const renderInputComponent = ({ ref, key, ...rest }) => {
  return <InputComponentWithRef {...rest} ref={ref} key={key} />;
};

const ChipInputAutoComplete = ({
  value,
  label,
  className,
  dataSource = [],
  maxChips = 5,
  onAdd = noop,
  onDelete = noop,
  rootClassName = "",
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const onSuggestionsFetchRequested = useCallback(
    (options) => {
      const prefix = options.value.toLowerCase();
      setSuggestions(
        dataSource.filter(
          (item) =>
            item.toLowerCase().startsWith(prefix) &&
            !value.includes(item) &&
            value.length < maxChips,
        ),
      );
    },
    [dataSource, value, maxChips],
  );

  const onSuggestionsClearRequested = useCallback(() => {
    setSuggestions([]);
    setInputValue("");
  }, []);

  const onSuggestionSelected = useCallback(
    (e, { suggestionValue }) => {
      onAdd(suggestionValue);
      e.preventDefault();
    },
    [onAdd],
  );

  const onInputChange = useCallback((event) => {
    const newValue = event.target.value;
    setInputValue(newValue);
  }, []);

  const onTryToAdd = useCallback(
    (inputValue) => {
      if (dataSource.includes(inputValue)) {
        onAdd(inputValue);
      } else {
        setInputValue("");
      }
    },
    [dataSource, onAdd],
  );

  const renderSuggestion = useCallback((suggestion, { isHighlighted }) => {
    return (
      <MenuItem
        component="div"
        selected={isHighlighted}
        style={{
          ...suggestionMenuItemStyle,
          ...(isHighlighted ? suggestionMenuItemStyleHighlighted : {}),
        }}
      >
        <div>{suggestion}</div>
      </MenuItem>
    );
  }, []);

  return (
    <Autosuggest
      theme={{
        ...autoSuggestTheme,
        container: `ChipInputAutoComplete ${rootClassName}`,
      }}
      inputProps={{
        value: inputValue,
        chips: value,
        onInput: onInputChange,
        onAddChip: onTryToAdd,
        onDeleteChip: onDelete,
        onChange: onInputChange,
        label,
        className,
      }}
      suggestions={suggestions}
      getSuggestionValue={(suggestion) => suggestion}
      renderInputComponent={renderInputComponent}
      renderSuggestion={renderSuggestion}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      onSuggestionSelected={onSuggestionSelected}
      focusInputOnSuggestionClick
      highlightFirstSuggestion
    />
  );
};

ChipInputAutoComplete.propTypes = {
  label: PropTypes.string,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  dataSource: PropTypes.arrayOf(PropTypes.string),
  maxChips: PropTypes.number,
  className: PropTypes.string,
  rootClassName: PropTypes.string,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
};

export default ChipInputAutoComplete;
