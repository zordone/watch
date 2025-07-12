import React, { useCallback } from "react";
import PropTypes from "prop-types";
import ChipInputAutoComplete from "./ChipInputAutoComplete";
import _ from "../../common/lodashReduced";
import data from "../../common/data.json";
import { noop } from "../service/utils";
import "./GenreField.css";

const GenreField = ({ value, onChange = noop, id, className = "", maxGenres = 5, ...rest }) => {
  const fireOnChange = useCallback(
    (newValue) => {
      if (_.isEqual(value, newValue)) {
        return;
      }
      const event = {
        target: { id, value: newValue },
      };
      onChange(event);
    },
    [value, onChange, id],
  );

  const onAddGenre = useCallback(
    (genre) => {
      fireOnChange(value.concat(genre));
    },
    [value, fireOnChange],
  );

  const onDeleteGenre = useCallback(
    (genre, index) => {
      const newValue = [...value];
      newValue.splice(index, 1);
      fireOnChange(newValue);
    },
    [value, fireOnChange],
  );

  return (
    <ChipInputAutoComplete
      value={value}
      onAdd={onAddGenre}
      onDelete={onDeleteGenre}
      dataSource={data.genres}
      rootClassName={className}
      className="GenreField"
      maxChips={maxGenres}
      {...rest}
    />
  );
};

GenreField.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.shape({}),
  label: PropTypes.string,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  maxGenres: PropTypes.number,
  onChange: PropTypes.func,
};

export default GenreField;
