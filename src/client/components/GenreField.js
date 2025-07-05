import React, { useCallback } from "react";
import PropTypes from "prop-types";
import ChipInputAutoComplete from "./ChipInputAutoComplete";
import _ from "../../common/lodashReduced";
import data from "../../common/data.json";
import { noop } from "../service/utils";
import "./GenreField.css";

const GenreField = ({ value, onChange, id, className, maxGenres, ...rest }) => {
  const fireOnChanged = useCallback(
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
      fireOnChanged(value.concat(genre));
    },
    [value, fireOnChanged],
  );

  const onDeleteGenre = useCallback(
    (genre, index) => {
      const newValue = [...value];
      newValue.splice(index, 1);
      fireOnChanged(newValue);
    },
    [value, fireOnChanged],
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

GenreField.defaultProps = {
  id: undefined,
  className: "",
  style: {},
  label: undefined,
  maxGenres: 5,
  onChange: noop,
};

export default GenreField;
