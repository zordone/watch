import { Search } from "@mui/icons-material";
import { TextField, InputAdornment } from "@mui/material";
import { useState, useEffect, useRef, useCallback, useMemo, ChangeEvent } from "react";
import { SearchKeywords } from "@client/service/search";
import { isEnumValue, noop } from "../service/utils";
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

const renderWord = (word: string, index: number) => {
  const isKeyword = isEnumValue(SearchKeywords, word);
  const className = isKeyword ? "SearchField-keyword" : "";
  return (
    <span key={`${word}-${index}`} className={className}>
      {word}
    </span>
  );
};

interface SearchFieldProps {
  onChange?: (value: string) => void;
  onShortcut?: (code: string, inSearch: boolean, isCmd: boolean) => void;
  value?: string;
}

export const SearchField = ({
  onChange = noop,
  onShortcut = noop,
  value: propValue = "",
}: SearchFieldProps) => {
  const [value, setValue] = useState(propValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const onKeyUp = useCallback(
    (event: KeyboardEvent) => {
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
    (event: KeyboardEvent) => {
      const inSearch = document.activeElement === inputRef.current;
      onShortcut(event.code, inSearch, Boolean(event.metaKey));
    },
    [onShortcut],
  );

  // update local state when prop value changes
  useEffect(() => setValue(propValue), [propValue]);

  // add remove listeners for key board shortcuts
  useEffect(() => {
    document.addEventListener("keyup", onKeyUp);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keyup", onKeyUp);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyUp, onKeyDown]);

  const onFieldChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value: inputValue } = event.target;
      const cleaned = inputValue.trimStart().replace(/\s+/g, " ").toLowerCase();
      onChange(cleaned);
      setValue(cleaned);
    },
    [onChange],
  );

  const words = useMemo(() => value.split(" ").map(renderWord), [value]);

  const emptyClass = value ? "not-empty" : "empty";
  return (
    <div className={`SearchField ${emptyClass}`}>
      <div className="SearchField-words">{words}</div>
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
