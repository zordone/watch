import { Button, Paper } from "@mui/material";
import { useCallback, useState } from "react";
import { isEnumValue } from "@client/service/utils";
import { Type, Rating, SortComparator, State } from "@common/enums";
import { useGoBackAndSetHash } from "../hooks/useGoBackAndSetHash";
import { actions } from "../store/store";
import "./Help.css";

const values = (obj: Record<string, string>, prefix = "") =>
  Object.values(obj)
    .filter(Boolean)
    .map((key) => `${prefix}${key}`);

const sections = [
  { title: "Type", keywords: values(Type) },
  { title: "State", keywords: values(State) },
  { title: "Audience", keywords: ["csaba", "vali"] },
  { title: "Rating", keywords: values(Rating, "#") },
  {
    title: "Technical",
    keywords: ["#unfinished", "#noposter", "#noimdb", "#unscraped"],
  },
  { title: "Sorting", keywords: values(SortComparator, "sort:") },
];

export const Help = () => {
  const goBackAndSetHash = useGoBackAndSetHash();

  const [selected, setSelected] = useState<string[]>([]);

  const onClose = useCallback(
    (_event?: React.MouseEvent, search?: string) => goBackAndSetHash(search),
    [goBackAndSetHash],
  );

  const onApply = useCallback(() => {
    const search = selected.filter((name) => !name.startsWith("sort:")).join(" ");
    const sort = selected.filter((name) => name.startsWith("sort:")).pop();

    if (search) {
      actions.setSearch(search);
    }

    const comparator = (sort ?? "").slice(5);
    if (isEnumValue(SortComparator, comparator)) {
      actions.setSort(comparator);
    }

    onClose(undefined, search);
  }, [onClose, selected]);

  const onClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const name = event.currentTarget.innerText;
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
        const comparator = name.slice(5);
        if (isEnumValue(SortComparator, comparator)) {
          actions.setSort(comparator);
        }
        onClose();
      } else {
        actions.setSearch(name);
        onClose(undefined, name);
      }
    },
    [onClose, selected],
  );

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
          <Button variant="contained" color="secondary" className="Item-button" onClick={onClose}>
            Close
          </Button>
        </div>
        <p className="Help-info">Use ⌘ + click to select multiple.</p>
      </Paper>
    </div>
  );
};
