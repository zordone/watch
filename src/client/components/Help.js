import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Paper } from "@mui/material";
import { useStore, actions } from "../store/store";
import { ItemType, RatingType, SortComparators, StateType } from "../../common/enums";
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

const Help = () => {
  const store = useStore();
  const { items } = store;

  const history = useHistory();
  const [selected, setSelected] = useState([]);

  const onClose = (_event, search) => {
    history.goBack();
    if (search) {
      updateHash(search);
    }
  };

  const onApply = () => {
    const search = selected.filter((name) => !name.startsWith("sort:")).join(" ");
    const sort = selected.filter((name) => name.startsWith("sort:")).pop();

    if (search) {
      actions.setSearch(search);
    }

    if (sort) {
      actions.setSort(items, sort.substr(5));
    }
    onClose(null, search);
  };

  const onClick = (event) => {
    const name = event.target.innerText;
    const isSort = name.startsWith("sort:");
    const isCmd = event.metaKey;

    // multiselect
    if (isCmd) {
      const nextSelected = selected.includes(name)
        ? selected.filter((x) => x !== name)
        : [...selected.filter((x) => !(isSort && x.startsWith("sort:"))), name];
      setSelected(nextSelected);
      return;
    }

    // single select
    if (isSort) {
      actions.setSort(items, name.substr(5));
      onClose();
    } else {
      actions.setSearch(name);
      onClose(null, name);
    }
  };
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
                      onClick={onClick}
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
            <Button variant="contained" color="primary" className="Item-button" onClick={onApply}>
              Apply
            </Button>
          )}
          <Button variant="contained" color="default" className="Item-button" onClick={onClose}>
            Close
          </Button>
        </div>
      </Paper>
    </div>
  );
};

export default Help;
