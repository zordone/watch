import React, { useEffect, useRef, useCallback } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import Add from "@material-ui/icons/Add";
import CheckCircle from "@material-ui/icons/CheckCircle";
import ItemTable from "./ItemTable";
import Header from "./Header";
import * as actions from "../redux/actions";
import * as selectors from "../redux/selectors";
import SearchField from "./SearchField";
import Loader from "./Loader";
import { noop } from "../service/utils";
import fixedHeaderWorkaround from "../service/fixedHeader";
import packageJson from "../../../package.json";
import { SearchKeywords, SortComparators } from "../../common/enums";
import { sortTitles } from "../service/sort";
import events, { Events } from "../service/events";
import { updateHash } from "../service/history";
import useThrottledCallback from "../hooks/useThrottledCallback";
import useOnMount from "../hooks/useOnMount";
import "./Home.css";

let isFirstMount = true;

const Home = ({
  history,
  location,
  items,
  search,
  filteredItems,
  firstLoad,
  currentId,
  sort,
  snackOpen,
  snackText,
  isFetched,
  fetchItems,
  setSearch,
  setFirstLoad,
  setCurrentId,
  setSort,
  setSnack,
  setIsFetched,
}) => {
  const currentSearchRef = useRef("");

  const scrollToCurrent = useCallback(() => {
    if (!currentId) return;
    const currentRow = document.querySelector(".ItemRow.current");
    if (currentRow) {
      currentRow.scrollIntoViewIfNeeded();
    }
    setCurrentId("");
  }, [currentId, setCurrentId]);

  const scrollToTop = () => {
    const firstRow = document.querySelector(".ItemRow");
    if (firstRow) {
      firstRow.scrollIntoViewIfNeeded();
    }
  };

  const updateSearchThrottled = useThrottledCallback(
    useCallback(
      (searchValue) => {
        if (searchValue.startsWith("sort:")) {
          // i'm not exactly sure how to do this now, or why it was even needed.
          // updateSearchThrottled.cancel();
          return;
        }
        const searchWords = searchValue
          .toLowerCase()
          .split(" ")
          .map((word) => word.trim())
          .filter(Boolean);
        if (!searchWords.length) {
          setSearch("", items);
          scrollToCurrent();
          updateHash(searchValue);
          return;
        }
        const filteredItemsResult = items.filter((item) =>
          searchWords.every((word) => {
            const { text, starts, equals } = item.searchData;
            const isKeyword = Object.values(SearchKeywords).includes(word);
            return (
              (!isKeyword && text.includes(word)) ||
              (!isKeyword && starts.find((startItem) => startItem.startsWith(word))) ||
              equals.includes(word)
            );
          }),
        );
        setSearch(searchValue, filteredItemsResult);
        updateHash(searchValue);
      },
      [items, scrollToCurrent, setSearch],
    ),
    1000,
  );

  const onSearchChanged = (searchValue) => {
    currentSearchRef.current = searchValue;
    updateSearchThrottled(searchValue);
  };

  const onAddNew = (event, imdbId) => {
    const imdbParam = imdbId ? `/${imdbId}` : "";
    history.push(`/item/new${imdbParam}`);
  };

  const onHelp = () => {
    history.push("/help");
  };

  const onLogoClick = () => {
    onSearchChanged("");
    scrollToTop();
  };

  const fetchData = (all = false) => {
    if (isFetched) {
      onSearchChanged(search);
      return;
    }
    fetchItems(all)
      .then(() => {
        onSearchChanged(search);
        if (all) {
          setIsFetched(true);
        }
      })
      .catch(console.error);
  };

  const onShortcut = (code, inSearch, cmdKey) => {
    if (code === "Enter") {
      // open first item
      const item = filteredItems[0];
      const isSortCommand = currentSearchRef.current.startsWith("sort:");
      if (item && !isSortCommand) {
        history.push(`/item/${item._id}`);
        return;
      }
      // set sort
      if (isSortCommand) {
        const newSort =
          currentSearchRef.current.replace("sort:", "").toLowerCase() || SortComparators.DEFAULT;
        const isValid = Object.values(SortComparators).includes(newSort);
        if (!isValid) {
          return;
        }
        if (sort !== newSort) {
          setSort(items, newSort);
          setSnack(true, `Sorted by ${sortTitles[newSort]}.`);
        }
        updateSearchThrottled("");
      }
    } else if (code === "KeyN" && !inSearch) {
      // add new item
      onAddNew();
    } else if (code === "KeyH" && !inSearch) {
      // show help
      onHelp();
    } else if ((cmdKey && code === "ArrowUp") || code === "Home") {
      // home
      scrollToTop();
    }
  };

  const onRowClick = (id, isCmd) => {
    const path = `/item/${id}`;
    if (isCmd) {
      window.open(path, "_blank");
      return;
    }
    setCurrentId(id);
    history.push(path);
  };

  const onSnackClose = () => {
    setSnack(false);
  };

  useOnMount(() => {
    // init search from url param
    if (isFirstMount) {
      const searchFromHash = (location.hash || "").slice(1);
      if (searchFromHash) {
        onSearchChanged(decodeURIComponent(searchFromHash));
      }
      isFirstMount = false;
    }

    fixedHeaderWorkaround();

    const onImdbPaste = (event) => {
      onAddNew(event, event.detail.imdbId);
    };

    events.addListener(Events.IMDB_PASTE, onImdbPaste);

    // initial short list
    setTimeout(() => {
      fetchData(false);
    }, 0);

    // full list a bit later
    setTimeout(() => {
      window.requestIdleCallback(() => fetchData(true));
    }, 5000);

    // on unmount
    return () => {
      setFirstLoad(false);
      events.removeListener(Events.IMDB_PASTE, onImdbPaste);
    };
  });

  useEffect(() => {
    scrollToCurrent();
  }, [search, filteredItems, snackOpen, scrollToCurrent]);

  // TODO: don't always rerender these buttons
  const searchField = (
    <SearchField onChange={onSearchChanged} onShortcut={onShortcut} value={search} />
  );
  // TODO: upgare mui icons and use proper question mark icon
  const helpButton = (
    <IconButton aria-label="Help" onClick={onHelp}>
      ?
    </IconButton>
  );
  const newButton = (
    <IconButton aria-label="Add new item" onClick={onAddNew}>
      <Add />
    </IconButton>
  );

  return (
    <div className="Home">
      <Header {...{ searchField, helpButton, newButton, onLogoClick }} />
      <main>
        <ItemTable items={filteredItems} currentId={currentId} onRowClick={onRowClick} />
        <div className="Home-footer">
          <span>
            {filteredItems.length} item
            {filteredItems.length === 1 ? "" : "s"}
          </span>
          <span>v{packageJson.version}</span>
        </div>
      </main>
      {firstLoad && <Loader progress={0} />}
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={onSnackClose}
        message={
          <span>
            <CheckCircle />
            {snackText}
          </span>
        }
        ContentProps={{
          classes: {
            root: "Home-snack",
            message: "Home-snackMessage",
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transitionDuration={500}
      />
    </div>
  );
};

Home.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    hash: PropTypes.string.isRequired,
  }).isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  search: PropTypes.string.isRequired,
  filteredItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  firstLoad: PropTypes.bool,
  currentId: PropTypes.string,
  sort: PropTypes.oneOf(Object.values(SortComparators)),
  snackOpen: PropTypes.bool,
  snackText: PropTypes.string,
  isFetched: PropTypes.bool,
  fetchItems: PropTypes.func,
  setSearch: PropTypes.func,
  setFirstLoad: PropTypes.func,
  setCurrentId: PropTypes.func,
  setSort: PropTypes.func,
  setSnack: PropTypes.func,
  setIsFetched: PropTypes.func,
};

Home.defaultProps = {
  firstLoad: false,
  currentId: "",
  sort: SortComparators.DEFAULT,
  snackOpen: false,
  snackText: "",
  isFetched: false,
  fetchItems: noop,
  setSearch: noop,
  setFirstLoad: noop,
  setCurrentId: noop,
  setSort: noop,
};

const mapStateToProps = (state) => ({
  items: selectors.getItems(state),
  search: selectors.getSearch(state),
  filteredItems: selectors.getFilteredItems(state),
  firstLoad: selectors.getFirstLoad(state),
  currentId: selectors.getCurrentId(state),
  sort: selectors.getSort(state),
  snackOpen: selectors.getSnackOpen(state),
  snackText: selectors.getSnackText(state),
  isFetched: selectors.getIsFetched(state),
});

const mapDispatchToProps = (dispatch) => ({
  fetchItems: (all) => dispatch(actions.fetchItems(all)),
  setSearch: (search, filteredItems) => dispatch(actions.setSearch(search, filteredItems)),
  setFirstLoad: (firstLoad) => dispatch(actions.setFirstLoad(firstLoad)),
  setCurrentId: (currentId) => dispatch(actions.setCurrentId(currentId)),
  setSort: (items, sort) => dispatch(actions.setSort(items, sort)),
  setSnack: (open, text) => dispatch(actions.setSnack(open, text)),
  setIsFetched: (isFetched) => dispatch(actions.setIsFetched(isFetched)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
