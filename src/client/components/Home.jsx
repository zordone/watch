import { Add } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import packageJson from "../../../package.json";
import { SearchKeywords, SortComparators } from "../../common/enums";
import { useDebouncedCallback } from "../hooks/useDebouncedCallback";
import { useOnMount } from "../hooks/useOnMount";
import { useSetHash } from "../hooks/useSetHash";
import { events, Events } from "../service/events";
import * as service from "../service/service";
import { sortTitles } from "../service/sort";
import { useStore, actions } from "../store/store";
import { Header } from "./Header";
import { ItemTable } from "./ItemTable";
import { Loader } from "./Loader";
import { SearchField } from "./SearchField";
import "./Home.css";

export const Home = () => {
  const store = useStore();
  const { items, search, filteredItems, isLoaderFinished, currentId, sort } = store;

  useQuery({
    queryKey: ["items"],
    queryFn: () =>
      service.listItems(true).catch((err) => {
        console.error("Error fetching items", err);
        throw err;
      }),
    select: (items) => {
      actions.setItems(items);
      return items;
    },
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const navigate = useNavigate();
  const setHash = useSetHash();

  const currentSearchRef = useRef();

  const scrollToCurrent = useCallback(() => {
    if (!currentId) return;
    const currentRow = document.querySelector(".ItemRow.current");
    if (currentRow) {
      currentRow.scrollIntoViewIfNeeded();
      // give time to the ItemRow current animation to finish
      setTimeout(() => actions.setCurrentId(""), 1500);
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
          actions.showSnack(`Sorted by ${sortTitles[newSort]}.`, "success");
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
      setTimeout(() => {
        actions.setCurrentId(id);
      }, 1000);
      navigate(path, { viewTransition: true });
    },
    [navigate],
  );

  useOnMount(() => {
    const onImdbPaste = (event) => {
      onAddNew(event, event.detail.imdbId);
    };

    events.addListener(Events.IMDB_PASTE, onImdbPaste);

    // on unmount
    return () => {
      events.removeListener(Events.IMDB_PASTE, onImdbPaste);
    };
  });

  // scroll to the current when the item list change
  useEffect(() => {
    scrollToCurrent();
  }, [search, filteredItems, scrollToCurrent]);

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
    </div>
  );
};
