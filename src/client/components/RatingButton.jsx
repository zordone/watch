import { ThumbUp, ThumbDown, Favorite } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import PropTypes from "prop-types";
import { useCallback } from "react";
import { RatingType } from "../../common/enums";
import { noop } from "../service/utils";
import "./RatingButton.css";

const Icons = {
  [RatingType.DISLIKE]: ThumbDown,
  [RatingType.LIKE]: ThumbUp,
  [RatingType.FAVORITE]: Favorite,
};

export const RatingButton = ({ value = "", onChange = noop }) => {
  const handleClick = useCallback(
    (event) => {
      const {
        currentTarget: {
          attributes: {
            rating: { value: ratingValue },
          },
        },
      } = event;
      onChange(ratingValue);
    },
    [onChange],
  );

  const buttons = Object.values(RatingType)
    .filter(Boolean)
    .map((rating) => {
      const activeClass = value === rating ? "active" : "";
      const Icon = Icons[rating];
      return (
        <IconButton
          key={rating}
          rating={rating}
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

RatingButton.propTypes = {
  value: PropTypes.oneOf(Object.values(RatingType)),
  onChange: PropTypes.func,
};
