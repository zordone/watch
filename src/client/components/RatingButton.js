import React from "react";
import PropTypes from "prop-types";
import { IconButton } from "@material-ui/core";
import ThumbUp from "@material-ui/icons/ThumbUp";
import ThumbDown from "@material-ui/icons/ThumbDown";
import Favorite from "@material-ui/icons/Favorite";
import { RatingType } from "../../common/enums";
import { noop } from "../service/utils";
import "./RatingButton.css";

const Icons = {
  [RatingType.DISLIKE]: ThumbDown,
  [RatingType.LIKE]: ThumbUp,
  [RatingType.FAVORITE]: Favorite,
};

class RatingButton extends React.PureComponent {
  handleClick = (event) => {
    const { onChange } = this.props;
    const {
      currentTarget: {
        attributes: {
          rating: { value },
        },
      },
    } = event;
    onChange(value);
  };

  render() {
    const { value } = this.props;
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
            onClick={this.handleClick}
          >
            <Icon />
          </IconButton>
        );
      });
    return <div className="RatingButton">{buttons}</div>;
  }
}

RatingButton.propTypes = {
  value: PropTypes.oneOf(Object.values(RatingType)),
  onChange: PropTypes.func,
};

RatingButton.defaultProps = {
  value: "",
  onChange: noop,
};

export default RatingButton;
