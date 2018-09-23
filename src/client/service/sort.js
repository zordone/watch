import { SortComparators } from '../../common/enums';

const compareValues = (a, b, asc = true) => {
    if (a < b) {
        return asc ? -1 : 1;
    }
    if (a > b) {
        return asc ? 1 : -1;
    }
    return 0;
};

const compareItemsDefault = (a, b) => (
    compareValues(a.state.num, b.state.num, true) ||
    compareValues(a.title, b.title, true)
);

const compareItemsCreated = (a, b) => (
    compareValues(a.created, b.created, false) ||
    compareValues(a.title, b.title, true)
);

const compareItemsUpdated = (a, b) => (
    compareValues(a.updated, b.updated, false) ||
    compareValues(a.title, b.title, true)
);

export default {
    [SortComparators.DEFAULT]: compareItemsDefault,
    [SortComparators.CREATED]: compareItemsCreated,
    [SortComparators.UPDATED]: compareItemsUpdated
};
