import { ParsedItem } from "@common/types";
import "./StateLabel.css";

const boldRegex = /^(s\d{2}|\d{4}.\d{2}.\d{2})$/i;

interface StateLabelProps {
  item: ParsedItem;
  className?: string;
}

export const StateLabel = ({ item, className = "" }: StateLabelProps) => {
  const { type, parts } = item.state;

  return (
    <div className={`StateLabel StateLabel-${type} ${className}`}>
      {parts.map((part) => (boldRegex.exec(part) ? <strong key={part}>{part}</strong> : part))}
    </div>
  );
};
