/* globals document */

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Search from "@material-ui/icons/Search";
import { SearchKeywords } from "../../common/enums";
import { noop } from "../service/utils";
import events, { Events } from "../service/events";
import "./SearchField.css";

class SearchField extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onSetInputRef = this.onSetInputRef.bind(this);
  }

  componentDidMount() {
    events.addListener(Events.KEYUP, this.onKeyUp);
    events.addListener(Events.KEYDOWN, this.onKeyDown);
  }

  componentWillReceiveProps(nextProps) {
    const { value: prevValue } = this.state;
    const { value: nextValue } = nextProps;
    if (prevValue !== nextValue) {
      this.setState({ value: nextValue });
    }
  }

  componentWillUnmount() {
    events.removeListener(Events.KEYUP, this.onKeyUp);
    events.removeListener(Events.KEYDOWN, this.onKeyDown);
  }

  onSetInputRef(ref) {
    this.inputRef = ref;
  }

  onFieldChange(event) {
    const { value } = event.target;
    const { onChange } = this.props;
    const cleaned = value.trimStart().replace(/\s+/g, " ");
    onChange(cleaned);
    this.setState({ value: cleaned });
  }

  onKeyUp(event) {
    if (event.code === "KeyF") {
      this.inputRef.focus();
    } else if (event.code === "Escape") {
      this.onFieldChange({ target: { value: "" } });
      this.inputRef.blur();
    }
  }

  onKeyDown(event) {
    const { onShortcut } = this.props;
    const inSearch = document.activeElement === this.inputRef;
    onShortcut(event.code, inSearch, Boolean(event.metaKey));
  }

  renderWord(word, index) {
    const isKeyword = Object.values(SearchKeywords).includes(word);
    const className = isKeyword ? "SearchField-keyword" : "";
    return (
      <span key={`${word}-${index}`} className={className}>
        {word}
      </span>
    );
  }

  render() {
    const { value } = this.state;
    const emptyClass = value ? "not-empty" : "empty";
    return (
      <div className={`SearchField ${emptyClass}`}>
        <div className="SearchField-words">{value.split(" ").map(this.renderWord)}</div>
        <TextField
          placeholder="Search"
          value={value}
          onChange={this.onFieldChange}
          inputRef={this.onSetInputRef}
          InputProps={{
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
          }}
          // eslint-disable-next-line react/jsx-no-duplicate-props
          inputProps={{
            autoComplete: "off",
            autoCorrect: "off",
            autoCapitalize: "off",
            spellCheck: "false",
            "aria-label": "search",
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
  value: PropTypes.string,
};

SearchField.defaultProps = {
  onChange: noop,
  onShortcut: noop,
  value: "",
};

export default SearchField;
