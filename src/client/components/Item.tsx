import { Create, Check, DeleteForever } from "@mui/icons-material";
import { Button, IconButton, LinearProgress, Paper } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router";
import { ItemLoadingFlag } from "@common/enums";
import { ParsedItem } from "@common/types";
import { useGoBack } from "../hooks/useGoBack";
import { itemState } from "../service/itemState";
import {
  createNewItem,
  deleteItemById,
  getItemById,
  saveNewItem,
  searchImages,
  updateItemById,
  NEW_ID,
} from "../service/service";
import { defaultParsedItem } from "../service/serviceUtils";
import { slugify } from "../service/utils";
import { useStore, actions } from "../store/store";
import { ItemDetails } from "./ItemDetails";
import { ItemForm } from "./ItemForm";
import { PosterSearch } from "./PosterSearch";
import "./Item.css";

const FORM = "form";
const DETAILS = "details";

interface Posters {
  visible: boolean;
  searching: boolean;
  images: string[];
}

const useItem = (id: string) => {
  const isNew = id === NEW_ID;

  // copy for local editing
  const [draftItem, setDraftItem] = useState(structuredClone(defaultParsedItem));

  const queryClient = useQueryClient();

  // fetch the item if not new
  const {
    data: fetchedItem,
    isPending,
    isLoading,
    isError,
  } = useQuery({
    enabled: !isNew,
    queryKey: ["item", id],
    queryFn: () => getItemById(id),
  });

  actions.setItemLoadingFlag(ItemLoadingFlag.ITEM, isPending && isLoading);

  // save item
  const saveMutation = useMutation({
    mutationKey: ["item-save"],
    mutationFn: (draft: ParsedItem) =>
      isNew ? saveNewItem(draft) : updateItemById(draft._id, draft),
    onSuccess: (savedItem) => queryClient.invalidateQueries({ queryKey: ["item", savedItem._id] }),
  });

  // delete item
  const deleteMutation = useMutation({
    mutationKey: ["item-delete"],
    mutationFn: (id: string) => deleteItemById(id),
  });

  // when the fetched item arrives (or changes), reset the draft
  useEffect(() => {
    if (fetchedItem) {
      setDraftItem(structuredClone(fetchedItem));
    }
  }, [fetchedItem]);

  return {
    isNew,
    draftItem,
    setDraftItem,
    saveMutation,
    deleteMutation,
    isError,
  };
};

export const Item = () => {
  const { id = NEW_ID, imdbId } = useParams();
  const store = useStore();
  const { items, sort, resort, isItemLoading } = store;

  const {
    draftItem,
    setDraftItem,
    saveMutation: { mutateAsync: saveMutationAsync },
    deleteMutation: { mutateAsync: deleteMutationAsync },
    isNew,
    isError: isItemError,
  } = useItem(id);

  const [page, setPage] = useState(DETAILS);
  const isNewInitialized = useRef(false);
  const [posters, setPosters] = useState<Posters>({
    visible: false,
    searching: false,
    images: [],
  });
  const [posterSearching, setPosterSearching] = useState(false);
  const [deleteSure, setDeleteSure] = useState(false);
  const deleteTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const onClose = useGoBack();

  const updateItemState = useCallback(
    (changedItem: ParsedItem, updateState = false) => {
      setDraftItem({
        ...changedItem,
        state: updateState ? itemState(changedItem) : changedItem.state,
      });
    },
    [setDraftItem],
  );

  const onChange = useCallback(
    (changedItem: ParsedItem) => {
      const updateState = page === DETAILS;
      updateItemState(changedItem, updateState);
    },
    [page, updateItemState],
  );

  const onSave = useCallback(() => {
    actions.setItemLoadingFlag(ItemLoadingFlag.SAVE, true);
    saveMutationAsync(draftItem)
      .then((saved) => {
        actions.updateItem(saved);
        actions.setCurrentId(saved._id);
        actions.showSnack("Item saved.", "success");
        onClose();
      })
      .catch((err) => {
        console.error(err);
        actions.showSnack("Failed to save item.", "error");
      })
      .finally(() => {
        actions.setItemLoadingFlag(ItemLoadingFlag.SAVE, false);
      });
  }, [draftItem, onClose, saveMutationAsync]);

  const onShowForm = useCallback(() => {
    setPage(FORM);
  }, []);

  const onShowDetails = useCallback(() => {
    setPage(DETAILS);
    updateItemState(draftItem, true);
  }, [draftItem, updateItemState]);

  const onPosterSearch = useCallback(() => {
    setPosters({ visible: true, searching: true, images: [] });
    setPosterSearching(true);
    actions.setItemLoadingFlag(ItemLoadingFlag.POSTER_SEARCH, true);
    const query = encodeURI(draftItem.title);
    searchImages(query)
      .then((images) => {
        setPosters({ visible: true, searching: false, images });
      })
      .catch((err) => {
        console.error(err);
        actions.showSnack("Failed to search posters.", "error");
      })
      .finally(() => {
        setPosterSearching(false);
        actions.setItemLoadingFlag(ItemLoadingFlag.POSTER_SEARCH, false);
      });
  }, [draftItem]);

  const onPosterSelect = useCallback(
    (url: string) => {
      if (url) {
        onChange({ ...draftItem, posterUrl: url });
      }
      setPosters({ visible: false, searching: false, images: [] });
    },
    [draftItem, onChange],
  );

  const onDelete = useCallback(() => {
    if (deleteSure) {
      clearTimeout(deleteTimerRef.current);
      actions.setItemLoadingFlag(ItemLoadingFlag.DELETE, true);
      deleteMutationAsync(draftItem._id)
        .then(() => {
          actions.deleteItem(draftItem._id);
          setDeleteSure(false);
          onClose();
          actions.showSnack("Item deleted.", "success");
        })
        .catch((err) => {
          console.error(err);
          setDeleteSure(false);
          actions.showSnack("Failed to delete item.", "error");
        })
        .finally(() => {
          actions.setItemLoadingFlag(ItemLoadingFlag.DELETE, false);
        });
    } else {
      setDeleteSure(true);
      deleteTimerRef.current = setTimeout(() => {
        setDeleteSure(false);
      }, 3000);
    }
  }, [deleteMutationAsync, deleteSure, draftItem._id, onClose]);

  const findByTitle = useCallback(
    (id: string, title: string) => {
      const titleSlug = slugify(title);
      return items.find(
        (currentItem) => currentItem._id !== id && slugify(currentItem.title) === titleSlug,
      );
    },
    [items],
  );

  // close and show snack on item fetch error
  useEffect(() => {
    if (isItemError) {
      actions.showSnack("Failed to fetch item.", "error");
      onClose();
    }
  }, [isItemError, onClose]);

  // if this is a new item, and we have and IMDb ID, start scraping automatically
  useEffect(() => {
    if (id === NEW_ID && !isNewInitialized.current) {
      isNewInitialized.current = true;
      const newItem = createNewItem();
      if (imdbId) {
        newItem.imdbId = imdbId;
      }
      setDraftItem(newItem);
      setPage(FORM);
    }
  }, [id, imdbId, setDraftItem]);

  // handle keyboard shortcuts
  useEffect(() => {
    const onKeyUp = (event: KeyboardEvent) => {
      const inInput = "INPUT,SELECT,TEXTAREA".includes(document.activeElement?.tagName ?? "none");
      if (event.code === "Escape") {
        onClose();
      } else if (!inInput && event.code === "KeyE") {
        setPage((currentPage) => (currentPage === DETAILS ? FORM : DETAILS));
      } else if (!inInput && event.code === "KeyI") {
        setPage(FORM);
        const imdbScrapeEvent = new CustomEvent("imdbScrape");
        document.dispatchEvent(imdbScrapeEvent);
      }
    };

    document.addEventListener("keyup", onKeyUp);

    return () => {
      document.removeEventListener("keyup", onKeyUp);
      if (deleteTimerRef.current) {
        clearTimeout(deleteTimerRef.current);
      }
    };
  }, [onClose]);

  // re-sort items when the store says we need to
  useEffect(() => {
    if (resort) {
      actions.setSort(sort);
    }
  }, [resort, sort]);

  const deleteClassName = `Item-button delete${deleteSure ? " sure" : ""}`;

  return (
    <div className="Item">
      <Paper className="Item-paper">
        {isItemLoading && <LinearProgress className="ItemForm-progress" />}
        <ItemDetails
          item={draftItem}
          onChange={onChange}
          visible={page === DETAILS}
          onPosterSearch={onPosterSearch}
          posterSearching={posterSearching}
        />
        <ItemForm
          item={draftItem}
          onChange={onChange}
          visible={page === FORM}
          findByTitle={findByTitle}
        />
        <div className="Item-buttons">
          <Button
            disabled={!draftItem.title}
            variant="contained"
            color="primary"
            className="Item-button"
            onClick={onSave}
          >
            Save
          </Button>
          <Button variant="contained" color="secondary" className="Item-button" onClick={onClose}>
            Cancel
          </Button>
          {!isNew && (
            <Button variant="contained" className={deleteClassName} onClick={onDelete}>
              <DeleteForever />
              <span className="title">&nbsp;Sure to delete?</span>
              <div className="timeout" />
            </Button>
          )}
        </div>
        {page === DETAILS && (
          <IconButton className="Item-pageButton" aria-label="Show form" onClick={onShowForm}>
            <Create />
          </IconButton>
        )}
        {page === FORM && (
          <IconButton className="Item-pageButton" aria-label="Show details" onClick={onShowDetails}>
            <Check />
          </IconButton>
        )}
      </Paper>
      <PosterSearch {...posters} onSelect={onPosterSelect} />
    </div>
  );
};
