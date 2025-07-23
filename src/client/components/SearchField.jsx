import { Search } from "@mui/icons-material";
import { TextField, InputAdornment } from "@mui/material";
import PropTypes from "prop-types";
import { useState, useEffect, useRef, useCallback } from "react";
import { SearchKeywords } from "../../common/enums";
import { events, Events } from "../service/events";
import { noop } from "../service/utils";
import "./SearchField.css";

const textFieldSlotProps = {
  input: {
    startAdornment: (
      <InputAdornment position="start">
        <Search />
      </InputAdornment>
    ),
    disableUnderline: true,
    classes: {
      root: "SearchField-input",
      focused: "focused",
    },
  },
  htmlInput: {
    autoComplete: "off",
    autoCorrect: "off",
    autoCapitalize: "off",
    spellCheck: "false",
    "aria-label": "search",
  },
};

export const SearchField = ({ onChange = noop, onShortcut = noop, value: propValue = "" }) => {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  // Update local state when prop value changes
  useEffect(() => {
    setValue(propValue);
  }, [propValue]);

  const onKeyUp = useCallback(
    (event) => {
      if (event.code === "KeyF") {
        inputRef.current?.focus();
      } else if (event.code === "Escape") {
        const cleaned = "";
        onChange(cleaned);
        setValue(cleaned);
        inputRef.current?.blur();
      }
    },
    [onChange],
  );

  const onKeyDown = useCallback(
    (event) => {
      const inSearch = document.activeElement === inputRef.current;
      onShortcut(event.code, inSearch, Boolean(event.metaKey));
    },
    [onShortcut],
  );

  useEffect(() => {
    events.addListener(Events.KEYUP, onKeyUp);
    events.addListener(Events.KEYDOWN, onKeyDown);

    return () => {
      events.removeListener(Events.KEYUP, onKeyUp);
      events.removeListener(Events.KEYDOWN, onKeyDown);
    };
  }, [onKeyUp, onKeyDown]);

  const onFieldChange = useCallback(
    (event) => {
      const { value: inputValue } = event.target;
      const cleaned = inputValue.trimStart().replace(/\s+/g, " ").toLowerCase();
      onChange(cleaned);
      setValue(cleaned);
    },
    [onChange],
  );

  const renderWord = useCallback((word, index) => {
    const isKeyword = Object.values(SearchKeywords).includes(word);
    const className = isKeyword ? "SearchField-keyword" : "";
    return (
      <span key={`${word}-${index}`} className={className}>
        {word}
      </span>
    );
  }, []);

  const emptyClass = value ? "not-empty" : "empty";
  return (
    <div className={`SearchField ${emptyClass}`}>
      <div className="SearchField-words">{value.split(" ").map(renderWord)}</div>
      <TextField
        placeholder="Filter"
        value={value}
        onChange={onFieldChange}
        inputRef={inputRef}
        variant="standard"
        slotProps={textFieldSlotProps}
        fullWidth
      />
    </div>
  );
};

SearchField.propTypes = {
  onChange: PropTypes.func,
  onShortcut: PropTypes.func,
  value: PropTypes.string,
};
