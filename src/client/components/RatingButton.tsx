import { ThumbUp, ThumbDown, Favorite } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useCallback } from "react";
import { Rating } from "@common/enums";
import { isEnumValue, noop } from "../service/utils";
import "./RatingButton.css";

const Icons: Record<Rating, React.ElementType> = {
  [Rating.DISLIKE]: ThumbDown,
  [Rating.LIKE]: ThumbUp,
  [Rating.FAVORITE]: Favorite,
  [Rating.EMPTY]: () => null,
};

interface RatingButtonProps {
  value?: string;
  onChange?: (value: Rating) => void;
}

export const RatingButton = ({ value = "", onChange = noop }: RatingButtonProps) => {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const { rating } = event.currentTarget.dataset;
      if (isEnumValue(Rating, rating)) {
        onChange(rating);
      }
    },
    [onChange],
  );

  const buttons = Object.values(Rating)
    .filter(Boolean)
    .map((rating) => {
      const activeClass = value === String(rating) ? "active" : "";
      const Icon = Icons[rating];
      return (
        <IconButton
          key={rating}
          data-rating={rating}
          className={`${rating} ${activeClass}`}
          aria-label="Show form"
          onClick={handleClick}
        >
          <Icon />
        </IconButton>
      );
    });
  return <div className="RatingButton">{buttons}</div>;
};
