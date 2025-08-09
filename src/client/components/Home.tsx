import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { SearchKeywords } from "@client/service/search";
import { isEnumValue } from "@client/service/utils";
import { SortComparator } from "@common/enums";
import packageJson from "../../../package.json";
import { useDebouncedCallback } from "../hooks/useDebouncedCallback";
import { useOnMount } from "../hooks/useOnMount";
import { useSetHash } from "../hooks/useSetHash";
import { ImdbPasteEventHandler } from "../service/events";
import { listItems } from "../service/service";
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
      listItems().catch((err) => {
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

  const currentSearchRef = useRef(search);

  const scrollToCurrent = useCallback(() => {
    if (!currentId) return;
    const currentRow = document.querySelector<HTMLElement>(".ItemRow.current");
    currentRow?.scrollIntoView({ block: "center" });
    // give time to the ItemRow current animation to finish
    setTimeout(() => actions.setCurrentId(""), 1500);
  }, [currentId]);

  const scrollToTop = useCallback(() => {
    const firstRow = document.querySelector(".ItemRow");
    firstRow?.scrollIntoView({ block: "center" });
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
        const isKeyword = isEnumValue(SearchKeywords, word);
        return (
          (!isKeyword && text.includes(word)) ||
          (!isKeyword && starts.some((startItem) => startItem.startsWith(word))) ||
          equals.includes(word)
        );
      }),
    );
    actions.setFilteredItems(newFilteredItems);
  }, [search, items]);

  // debounced update of the search term and the URL hash
  const updateSearchDebounced = useDebouncedCallback(
    useCallback(
      (searchValue: string) => {
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
    (searchValue: string) => {
      if (searchValue === currentSearchRef.current) return;
      currentSearchRef.current = searchValue;
      updateSearchDebounced(searchValue);
    },
    [updateSearchDebounced],
  );

  const onAddNew = useCallback(
    (event?: Event, imdbId?: string) => {
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

  const onShortcut = useCallback(
    (code: string, inSearch: boolean, cmdKey: boolean) => {
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
            currentSearchRef.current.replace("sort:", "").toLowerCase() || SortComparator.DEFAULT;
          if (!isEnumValue(SortComparator, newSort)) {
            return;
          }
          if (sort !== newSort) {
            actions.setSort(newSort);
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
    },
    [filteredItems, navigate, onAddNew, onHelp, scrollToTop, sort, updateSearchDebounced],
  );

  const onRowClick = useCallback(
    (id: string, isCmd: boolean) => {
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

  // add/remove listeners for the custom IMDb ID pasting event
  useOnMount(() => {
    const onImdbPaste: ImdbPasteEventHandler = (event) => {
      onAddNew(event, event.detail.imdbId);
    };

    document.addEventListener("imdbPaste", onImdbPaste);

    return () => {
      document.removeEventListener("imdbPaste", onImdbPaste);
    };
  });

  // scroll to the current when the item list change
  useEffect(() => {
    scrollToCurrent();
  }, [search, filteredItems, scrollToCurrent]);

  return (
    <div className="Home">
      <Header onHelp={onHelp} onAddNew={onAddNew} onLogoClick={onLogoClick}>
        <SearchField onChange={onSearchChanged} onShortcut={onShortcut} value={search} />
      </Header>
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
