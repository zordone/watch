import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button, Paper } from "@material-ui/core";
import * as actions from "../redux/actions";
import * as selectors from "../redux/selectors";
import { ItemType, RatingType, SortComparators, StateType } from "../../common/enums";
import { noop } from "../service/utils";
import { updateHash } from "../service/history";
import "./Help.css";

const values = (obj, prefix = "") =>
  Object.values(obj)
    .filter(Boolean)
    .map((key) => `${prefix}${key}`);

const sections = [
  { title: "Type", keywords: values(ItemType) },
  { title: "State", keywords: values(StateType) },
  { title: "Rating", keywords: values(RatingType, "#") },
  { title: "Audience", keywords: ["csaba", "vali"] },
  {
    title: "Technical",
    keywords: ["#finished", "#unfinished", "#noposter", "#noimdb", "#unscraped"],
  },
  { title: "Sorting", keywords: values(SortComparators, "sort:") },
];

class Help extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
    };
    this.onClose = this.onClose.bind(this);
    this.onApply = this.onApply.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onClose(_event, search) {
    const { history } = this.props;
    history.goBack();
    if (search) {
      updateHash(search);
    }
  }

  onApply() {
    const { items, setSearch, setSort } = this.props;
    const { selected } = this.state;
    const search = selected.filter((name) => !name.startsWith("sort:")).join(" ");
    const sort = selected.filter((name) => name.startsWith("sort:")).pop();

    if (search) {
      setSearch(search, items);
    }

    if (sort) {
      setSort(items, sort.substr(5));
    }
    this.onClose(null, search);
  }

  onClick(event) {
    const { items, setSearch, setSort } = this.props;
    const name = event.target.innerText;
    const isSort = name.startsWith("sort:");
    const isCmd = event.metaKey;

    // multiselect
    if (isCmd) {
      const { selected: prevSelected } = this.state;
      const nextSelected = prevSelected.includes(name)
        ? prevSelected.filter((x) => x !== name)
        : [...prevSelected.filter((x) => !(isSort && x.startsWith("sort:"))), name];
      this.setState({ selected: nextSelected });
      return;
    }

    // single select
    if (isSort) {
      setSort(items, name.substr(5));
      this.onClose();
    } else {
      setSearch(name, items);
      this.onClose(null, name);
    }
  }

  render() {
    const { selected } = this.state;
    return (
      <div className="Help">
        <Paper className="Help-paper">
          <div className="Help-sections">
            {sections.map(({ title, keywords }) => (
              <section key={title}>
                <h3>{title}</h3>
                <div className="Help-keywords">
                  {keywords
                    .filter(Boolean)
                    .sort()
                    .map((keyword) => (
                      <button
                        key={keyword}
                        type="button"
                        onClick={this.onClick}
                        className={selected.includes(keyword) ? "selected" : ""}
                      >
                        {keyword}
                      </button>
                    ))}
                </div>
              </section>
            ))}
          </div>
          <div className="Help-buttons">
            {selected.length > 0 && (
              <Button
                variant="contained"
                color="primary"
                className="Item-button"
                onClick={this.onApply}
              >
                Apply
              </Button>
            )}
            <Button
              variant="contained"
              color="default"
              className="Item-button"
              onClick={this.onClose}
            >
              Close
            </Button>
          </div>
        </Paper>
      </div>
    );
  }
}

Help.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  setSearch: PropTypes.func,
  setSort: PropTypes.func,
};

Help.defaultProps = {
  setSearch: noop,
  setSort: noop,
};

const mapStateToProps = (state) => ({
  items: selectors.getItems(state),
});

const mapDispatchToProps = (dispatch) => ({
  setSearch: (search, filteredItems) => dispatch(actions.setSearch(search, filteredItems)),
  setSort: (items, sort) => dispatch(actions.setSort(items, sort)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Help);
