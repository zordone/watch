import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import MenuItem from "@material-ui/core/MenuItem";
import ChipInput from "material-ui-chip-input";
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
    zIndex: 1,
    top: "100%",
    width: "100%",
    backgroundColor: "#515151",
    boxShadow:
      "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)",
    boxSizing: "border-box",
    borderRadius: "0 0 4px 4px",
  },
  suggestionsContainerOpen: {
    padding: "4px",
  },
  suggestionsList: {
    display: "block",
    margin: 0,
    padding: 0,
  },
  suggestion: {
    display: "block",
  },
};

const suggestionMenuItemStyle = {
  padding: "0.2rem",
  borderRadius: "4px",
  color: "#FFF4",
};

const suggestionMenuItemStyleHighlighted = {
  color: "#FFF",
  background: "#FFF2",
};

const ChipInputAutoComplete = ({
  value,
  dataSource,
  maxChips,
  onAdd,
  onDelete,
  label,
  rootClassName,
  className,
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

  const onInputChange = useCallback((event, { newValue }) => {
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

  const renderInputComponent = useCallback((inputProps) => {
    // we only destructure some of these to omit them from `rest`
    // eslint-disable-next-line no-unused-vars
    const { chips, value, onChange, className, classes, dataSource, ...rest } = inputProps;
    return (
      <ChipInput
        value={chips}
        classes={{
          chipContainer: "chipContainer",
          chip: "chip",
          label: "label",
        }}
        onUpdateInput={onChange}
        className="GenreField"
        clearInputValueOnChange
        {...rest}
      />
    );
  }, []);

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
        container: `ChipInputAutoComplete-rootContainer ${rootClassName}`,
      }}
      inputProps={{
        value: inputValue,
        chips: value,
        onChange: onInputChange,
        onAdd: onTryToAdd,
        onDelete,
        label,
      }}
      className={className}
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

ChipInputAutoComplete.defaultProps = {
  dataSource: [],
  maxChips: 5,
  className: "",
  rootClassName: "",
  onAdd: noop,
  onDelete: noop,
};

export default ChipInputAutoComplete;
