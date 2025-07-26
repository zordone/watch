import { SortComparator } from "@common/enums";
import { ParsedItem } from "@common/types";

type Comparable = number | string | Date;
type Comparator = (a: ParsedItem, b: ParsedItem) => number;

const compareValues = (a: Comparable, b: Comparable, asc = true) => {
  if (a < b) return asc ? -1 : 1;
  if (a > b) return asc ? 1 : -1;
  return 0;
};

export const sortTitles: Record<SortComparator, string> = Object.freeze({
  [SortComparator.DEFAULT]: "item state",
  [SortComparator.CREATED]: "creation date",
  [SortComparator.UPDATED]: "last update date",
});

export const sortComparators: Record<SortComparator, Comparator> = Object.freeze({
  [SortComparator.DEFAULT]: (a, b) =>
    compareValues(a.state.num, b.state.num, true) || compareValues(a.title, b.title, true),
  [SortComparator.CREATED]: (a, b) =>
    compareValues(a.created, b.created, false) || compareValues(a.title, b.title, true),
  [SortComparator.UPDATED]: (a, b) =>
    compareValues(a.updated, b.updated, false) || compareValues(a.title, b.title, true),
});
