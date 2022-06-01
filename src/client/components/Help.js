import React from "react";
import PropTypes from "prop-types";
import { SearchKeywords, SortComparators } from "../../common/enums";
import { sortTitles } from "../service/sort";
import "./Help.css";

const Row = ({ name, desc }) => (
  <li key={name}>{[<code>{name}</code>, desc ? " - " : "", desc]}</li>
);

Row.propTypes = {
  name: PropTypes.string.isRequired,
  desc: PropTypes.string,
};

Row.defaultProps = {
  desc: "",
};

const Help = () => (
  <div className="Help">
    <a href="/">⬅ Home</a>
    <div className="columns">
      <section>
        <h3>Search Keywords</h3>
        <ul>
          {Object.values(SearchKeywords).map((name) => (
            <Row name={name} />
          ))}
        </ul>
      </section>
      <section>
        <h3>Sorting Methods</h3>
        <ul>
          {Object.values(SortComparators).map((name) => (
            <Row name={`sort:${name}`} desc={`Sort by ${sortTitles[name]}`} />
          ))}
        </ul>
      </section>
    </div>
  </div>
);

export default Help;
