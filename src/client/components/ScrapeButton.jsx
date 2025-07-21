import React from "react";
import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import { CloudDownload } from "@mui/icons-material";
import { noop } from "../service/utils";
import "./ScrapeButton.css";

const ScrapeButton = ({
  visible = true,
  className = "",
  ariaLabel,
  inProgress = false,
  onClick = noop,
}) => {
  const visibleClassName = visible ? "" : "hidden";
  const progressClassName = inProgress ? "progress" : "";
  return (
    <IconButton
      className={`ScrapeButton ${className} ${progressClassName} ${visibleClassName}`}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <CloudDownload />
    </IconButton>
  );
};

ScrapeButton.propTypes = {
  className: PropTypes.string,
  visible: PropTypes.bool,
  ariaLabel: PropTypes.string.isRequired,
  inProgress: PropTypes.bool,
  onClick: PropTypes.func,
};

export default ScrapeButton;
