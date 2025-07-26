import { CloudDownload } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { noop } from "../service/utils";
import "./ScrapeButton.css";

interface ScrapeButtonProps {
  visible?: boolean;
  className?: string;
  ariaLabel: string;
  inProgress?: boolean;
  onClick?: () => void;
}

export const ScrapeButton = ({
  visible = true,
  className = "",
  ariaLabel,
  inProgress = false,
  onClick = noop,
}: ScrapeButtonProps) => {
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
