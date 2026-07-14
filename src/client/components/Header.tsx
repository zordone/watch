import { ReactNode } from "react";
import { Add, Link, QuestionMark } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { noop } from "../service/utils";
import "./Header.css";

interface HeaderProps {
  children?: ReactNode;
  onShare?: () => void;
  onHelp?: () => void;
  onAddNew?: () => void;
  onLogoClick?: () => void;
}

export const Header = ({
  children,
  onShare = noop,
  onHelp = noop,
  onAddNew = noop,
  onLogoClick = noop,
}: HeaderProps) => (
  <header className="Header">
    <div className="Header-logoAndTitle">
      <button type="button" className="Header-logoButton" onClick={onLogoClick}>
        <img className="Header-logo" alt="logo" src="/app-logo.webp" draggable="false" />
      </button>
      <img className="Header-title" alt="watch" src="/app-title.webp" draggable="false" />
    </div>
    {children}
    <div className="Header-buttons">
      <IconButton aria-label="Copy link" onClick={onShare}>
        <Link />
      </IconButton>
      <IconButton aria-label="Help" onClick={onHelp}>
        <QuestionMark />
      </IconButton>
      <IconButton aria-label="Add new item" onClick={onAddNew}>
        <Add />
      </IconButton>
    </div>
  </header>
);
