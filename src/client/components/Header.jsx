import { Add, QuestionMark } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import PropTypes from "prop-types";
import { noop } from "../service/utils";
import "./Header.css";

export const Header = ({ children, onHelp = noop, onAddNew = noop, onLogoClick = noop }) => (
  <header className="Header">
    <div className="Header-logoAndTitle">
      <button type="button" className="Header-logoButton" onClick={onLogoClick}>
        <img className="Header-logo" alt="logo" src="/app-logo.webp" draggable="false" />
      </button>
      <img className="Header-title" alt="watch" src="/app-title.webp" draggable="false" />
    </div>
    {children}
    <div className="Header-buttons">
      <IconButton aria-label="Help" onClick={onHelp}>
        <QuestionMark />
      </IconButton>
      <IconButton aria-label="Add new item" onClick={onAddNew}>
        <Add />
      </IconButton>
    </div>
  </header>
);

Header.propTypes = {
  children: PropTypes.node,
  onHelp: PropTypes.func,
  onAddNew: PropTypes.func,
  onLogoClick: PropTypes.func,
};
