import React, { useEffect, useRef, useCallback } from "react";
import { connect } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
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
import { useDebouncedCallback } from "../hooks/useDebouncedCallback";
import { useOnMount } from "../hooks/useOnMount";
import "./Home.css";

let isFirstMount = true;

const Home = ({
  items,
  search,
  filteredItems,
  firstLoad,
  currentId,
  sort,
  snackOpen,
  snackText,
  fetchItems,
  setSearch,
  setFilteredItems,
  setFirstLoad,
  setCurrentId,
  setSort,
  setSnack,
}) => {
  const history = useHistory();
  const location = useLocation();
  const currentSearchRef = useRef();

  const scrollToCurrent = useCallback(() => {
    if (!currentId) return;
    const currentRow = document.querySelector(".ItemRow.current");
    if (currentRow) {
      currentRow.scrollIntoViewIfNeeded();
      // give time to the ItemRow current animation to finish
      setTimeout(() => setCurrentId(""), 1000);
    }
  }, [currentId, setCurrentId]);

  const scrollToTop = useCallback(() => {
    const firstRow = document.querySelector(".ItemRow");
    if (firstRow) {
      firstRow.scrollIntoViewIfNeeded();
    }
  }, []);

  // filter items when search term changes (or the item list)
  useEffect(() => {
    const searchWords = search
      .toLowerCase()
      .split(" ")
      .map((word) => word.trim())
      .filter(Boolean);
    if (!searchWords.length) {
      setFilteredItems(items);
      return;
    }
    const newFilteredItems = items.filter((item) =>
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
    setFilteredItems(newFilteredItems);
  }, [search, items, setFilteredItems]);

  // debounced update of the search term and the URL hash
  const updateSearchDebounced = useDebouncedCallback(
    useCallback(
      (searchValue) => {
        // these are special commands, not typed by the user, but passed by the help dialog.
        // these shouldn't become the visible search term, so we can just ignore them here.
        if (searchValue.startsWith("sort:")) {
          return;
        }
        setSearch(searchValue);
        updateHash(searchValue);
      },
      [setSearch],
    ),
    500,
  );

  // search term was changed on another page, then coming back here
  useEffect(() => {
    updateHash(search);
  }, [search]);

  const onSearchChanged = useCallback(
    (searchValue) => {
      if (searchValue === currentSearchRef.current) return;
      currentSearchRef.current = searchValue;
      updateSearchDebounced(searchValue);
    },
    [updateSearchDebounced],
  );

  const onAddNew = useCallback(
    (event, imdbId) => {
      const imdbParam = imdbId ? `/${imdbId}` : "";
      history.push(`/item/new${imdbParam}`);
    },
    [history],
  );

  const onHelp = useCallback(() => {
    history.push("/help");
  }, [history]);

  const onLogoClick = useCallback(() => {
    onSearchChanged("");
    scrollToTop();
  }, [onSearchChanged, scrollToTop]);

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
        updateSearchDebounced("");
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

  const onRowClick = useCallback(
    (id, isCmd) => {
      const path = `/item/${id}`;
      if (isCmd) {
        window.open(path, "_blank");
        return;
      }
      setCurrentId(id);
      history.push(path);
    },
    [history, setCurrentId],
  );

  const onSnackClose = () => {
    setSnack(false);
  };

  useOnMount(() => {
    // init search from url param
    if (isFirstMount) {
      isFirstMount = false;
      // initialise search term from URL
      const searchFromHash = (location.hash || "").slice(1);
      if (searchFromHash) {
        onSearchChanged(decodeURIComponent(searchFromHash));
      }
      // fetch all data (as opposed to initial short list first, then full list )
      fetchItems(true).catch(console.error);
    }

    fixedHeaderWorkaround();

    const onImdbPaste = (event) => {
      onAddNew(event, event.detail.imdbId);
    };

    events.addListener(Events.IMDB_PASTE, onImdbPaste);

    // on unmount
    return () => {
      setFirstLoad(false);
      events.removeListener(Events.IMDB_PASTE, onImdbPaste);
    };
  });

  useEffect(() => {
    scrollToCurrent();
  }, [search, filteredItems, snackOpen, scrollToCurrent]);

  // TODO: pass these down as children
  const searchField = (
    <SearchField onChange={onSearchChanged} onShortcut={onShortcut} value={search} />
  );
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
      {firstLoad && <Loader />}
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
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  search: PropTypes.string.isRequired,
  filteredItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  firstLoad: PropTypes.bool,
  currentId: PropTypes.string,
  sort: PropTypes.oneOf(Object.values(SortComparators)),
  snackOpen: PropTypes.bool,
  snackText: PropTypes.string,
  fetchItems: PropTypes.func,
  setSearch: PropTypes.func,
  setFilteredItems: PropTypes.func,
  setFirstLoad: PropTypes.func,
  setCurrentId: PropTypes.func,
  setSort: PropTypes.func,
  setSnack: PropTypes.func,
};

Home.defaultProps = {
  firstLoad: false,
  currentId: "",
  sort: SortComparators.DEFAULT,
  snackOpen: false,
  snackText: "",
  fetchItems: noop,
  setSearch: noop,
  setFilteredItems: noop,
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
});

const mapDispatchToProps = (dispatch) => ({
  fetchItems: (all) => dispatch(actions.fetchItems(all)),
  setSearch: (search) => dispatch(actions.setSearch(search)),
  setFilteredItems: (filteredItems) => dispatch(actions.setFilteredItems(filteredItems)),
  setFirstLoad: (firstLoad) => dispatch(actions.setFirstLoad(firstLoad)),
  setCurrentId: (currentId) => dispatch(actions.setCurrentId(currentId)),
  setSort: (items, sort) => dispatch(actions.setSort(items, sort)),
  setSnack: (open, text) => dispatch(actions.setSnack(open, text)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
