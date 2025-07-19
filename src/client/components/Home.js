import React, { useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router";
import { IconButton, Snackbar } from "@mui/material";
import { Add, CheckCircle } from "@mui/icons-material";
import ItemTable from "./ItemTable";
import Header from "./Header";
import { useStore, actions } from "../store/store";
import SearchField from "./SearchField";
import Loader from "./Loader";
import fixedHeaderWorkaround from "../service/fixedHeader";
import packageJson from "../../../package.json";
import { SearchKeywords, SortComparators } from "../../common/enums";
import { sortTitles } from "../service/sort";
import events, { Events } from "../service/events";
import { useDebouncedCallback } from "../hooks/useDebouncedCallback";
import { useOnMount } from "../hooks/useOnMount";
import { useSetHash } from "../hooks/useSetHash";
import "./Home.css";

let isFirstMount = true;

const snackBarSlotProps = {
  content: {
    classes: {
      root: "Home-snack",
      message: "Home-snackMessage",
    },
  },
};

const Home = () => {
  const store = useStore();
  const { items, search, filteredItems, isLoaderFinished, currentId, sort, snackOpen, snackText } =
    store;

  const navigate = useNavigate();
  const location = useLocation();
  const setHash = useSetHash();

  const currentSearchRef = useRef();

  const scrollToCurrent = useCallback(() => {
    if (!currentId) return;
    const currentRow = document.querySelector(".ItemRow.current");
    if (currentRow) {
      currentRow.scrollIntoViewIfNeeded();
      // give time to the ItemRow current animation to finish
      setTimeout(() => actions.setCurrentId(""), 1000);
    }
  }, [currentId]);

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
      actions.setFilteredItems(items);
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
    actions.setFilteredItems(newFilteredItems);
  }, [search, items]);

  // debounced update of the search term and the URL hash
  const updateSearchDebounced = useDebouncedCallback(
    useCallback(
      (searchValue) => {
        // these are special commands, not typed by the user, but passed by the help dialog.
        // these shouldn't become the visible search term, so we can just ignore them here.
        if (searchValue.startsWith("sort:")) {
          return;
        }
        actions.setSearch(searchValue);
        setHash(searchValue);
      },
      [setHash],
    ),
    500,
  );

  // search term was changed on another page, then coming back here
  useEffect(() => {
    setHash(search);
  }, [setHash, search]);

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
      navigate(`/item/new${imdbParam}`, { viewTransition: true });
    },
    [navigate],
  );

  const onHelp = useCallback(() => {
    navigate("/help", { viewTransition: true });
  }, [navigate]);

  const onLogoClick = useCallback(() => {
    onSearchChanged("");
    scrollToTop();
  }, [onSearchChanged, scrollToTop]);

  const onShortcut = (code, inSearch, cmdKey) => {
    if (code === "Enter") {
      // open first item
      const item = filteredItems[0];
      const isSortCommand = currentSearchRef.current?.startsWith("sort:");
      if (item && !isSortCommand) {
        navigate(`/item/${item._id}`, { viewTransition: true });
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
          actions.setSort(items, newSort);
          actions.setSnack(true, `Sorted by ${sortTitles[newSort]}.`);
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
      actions.setCurrentId(id);
      navigate(path, { viewTransition: true });
    },
    [navigate],
  );

  const onSnackClose = () => {
    actions.setSnack(false);
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
      actions.fetchItems(true).catch(console.error);
    }

    fixedHeaderWorkaround();

    const onImdbPaste = (event) => {
      onAddNew(event, event.detail.imdbId);
    };

    events.addListener(Events.IMDB_PASTE, onImdbPaste);

    // on unmount
    return () => {
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
      {!isLoaderFinished && <Loader />}
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
        slotProps={snackBarSlotProps}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transitionDuration={500}
      />
    </div>
  );
};

export default Home;
