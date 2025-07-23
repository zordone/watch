import { Create, Check, DeleteForever } from "@mui/icons-material";
import { Button, IconButton, LinearProgress, Paper } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { Const, ItemLoadingFlags } from "../../common/enums";
import { useGoBack } from "../hooks/useGoBack";
import { events, Events } from "../service/events";
import { itemState } from "../service/itemState";
import * as service from "../service/service";
import { defaultItem } from "../service/serviceUtils";
import { slugify } from "../service/utils";
import { useStore, actions } from "../store/store";
import { ItemDetails } from "./ItemDetails";
import { ItemForm } from "./ItemForm";
import { PosterSearch } from "./PosterSearch";
import "./Item.css";

const FORM = "form";
const DETAILS = "details";

const useItem = (id) => {
  const isNew = id === Const.NEW;

  // copy for local editing
  const [draftItem, setDraftItem] = useState(defaultItem);

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
    queryFn: () => service.getItemById(id),
  });

  actions.setItemLoadingFlag(ItemLoadingFlags.ITEM, isPending && isLoading);

  // save item
  const saveMutation = useMutation({
    mutationKey: ["item-save"],
    mutationFn: (draft) => {
      return isNew ? service.saveNewItem(draft) : service.updateItemById(draft._id, draft);
    },
    onSuccess: (savedItem) => {
      queryClient.invalidateQueries({ queryKey: ["item", savedItem._id] });
    },
  });

  // delete item
  const deleteMutation = useMutation({
    mutationKey: ["item-delete"],
    mutationFn: (id) => service.deleteItemById(id),
    onSuccess: (deletedItem) => {
      queryClient.invalidateQueries({ queryKey: ["item", deletedItem._id] });
    },
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
  const { id, imdbId } = useParams();
  const store = useStore();
  const { items, sort, resort, isItemLoading } = store;

  const {
    draftItem,
    setDraftItem,
    saveMutation,
    deleteMutation,
    isNew,
    isError: isItemError,
  } = useItem(id);

  const [page, setPage] = useState(DETAILS);
  const [posters, setPosters] = useState({
    visible: false,
    searching: false,
    images: [],
  });
  const [posterSearching, setPosterSearching] = useState(false);
  const [error, setError] = useState("");
  const [deleteSure, setDeleteSure] = useState(false);

  if (isItemError && !error) {
    setError("Failed to fetch item.");
  }

  const deleteTimerRef = useRef();

  const onClose = useGoBack();

  const updateItemState = (changedItem, updateState = false) => {
    setDraftItem({
      ...changedItem,
      state: updateState ? itemState(changedItem) : changedItem.state,
    });
  };

  const onChange = (changedItem) => {
    const updateState = page === DETAILS;
    updateItemState(changedItem, updateState);
  };

  const onSave = () => {
    actions.setItemLoadingFlag(ItemLoadingFlags.SAVE, true);
    return saveMutation
      .mutateAsync(draftItem)
      .then((saved) => {
        if (isNew) {
          actions.addNewItem(saved);
        }
        actions.updateItem(saved);
        actions.setCurrentId(saved._id);
        actions.showSnack("Item saved.", "success");
        onClose();
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        actions.showSnack("Failed to save item.", "error");
      })
      .finally(() => {
        actions.setItemLoadingFlag(ItemLoadingFlags.SAVE, false);
      });
  };

  const onShowForm = () => {
    setPage(FORM);
  };

  const onShowDetails = () => {
    setPage(DETAILS);
    updateItemState(draftItem, true);
  };

  const onPosterSearch = () => {
    setPosters({ visible: true, searching: true, images: [] });
    setPosterSearching(true);
    actions.setItemLoadingFlag(ItemLoadingFlags.POSTER_SEARCH, true);
    const query = encodeURI(draftItem.title);
    return service
      .searchImages(query)
      .then((images) => {
        setPosters({ visible: true, searching: false, images });
      })
      .catch((err) => {
        console.error(err);
        actions.showSnack("Failed to search posters.", "error");
      })
      .finally(() => {
        setPosterSearching(false);
        actions.setItemLoadingFlag(ItemLoadingFlags.POSTER_SEARCH, false);
      });
  };

  const onPosterSelect = (url) => {
    if (url) {
      onChange({ ...draftItem, posterUrl: url });
    }
    setPosters({ visible: false, searching: false, images: [] });
  };

  const onDelete = () => {
    if (deleteSure) {
      clearTimeout(deleteTimerRef.current);
      actions.setItemLoadingFlag(ItemLoadingFlags.DELETE, true);
      return deleteMutation
        .mutateAsync(draftItem._id)
        .then(() => {
          actions.deleteItem(items, draftItem._id);
          setError("");
          setDeleteSure(false);
          onClose();
          actions.showSnack("Item deleted.", "success");
        })
        .catch((err) => {
          console.error(err);
          setError(err.message);
          setDeleteSure(false);
          actions.showSnack("Failed to delete item.", "error");
        })
        .finally(() => {
          actions.setItemLoadingFlag(ItemLoadingFlags.DELETE, false);
        });
    } else {
      setDeleteSure(true);
      deleteTimerRef.current = setTimeout(() => {
        setDeleteSure(false);
      }, 3000);
    }
  };

  const findByTitle = (id, title) => {
    const titleSlug = slugify(title);
    return items.find(
      (currentItem) => currentItem._id !== id && slugify(currentItem.title) === titleSlug,
    );
  };

  useEffect(() => {
    if (id === Const.NEW) {
      const newItem = service.createNewItem();
      if (id === Const.NEW && imdbId) {
        newItem.imdbId = imdbId;
      }
      setDraftItem(newItem);
      setPage(FORM);
    }

    const onKeyUp = (event) => {
      const inInput = "INPUT,SELECT,TEXTAREA".includes(document.activeElement.tagName);
      if (event.code === "Escape") {
        onClose();
      } else if (!inInput && event.code === "KeyE") {
        setPage((currentPage) => (currentPage === DETAILS ? FORM : DETAILS));
      } else if (!inInput && event.code === "KeyI") {
        setPage(FORM);
        events.dispatch(Events.IMDB_SCRAPE);
      }
    };

    events.addListener(Events.KEYUP, onKeyUp);

    return () => {
      events.removeListener(Events.KEYUP, onKeyUp);
      if (deleteTimerRef.current) {
        clearTimeout(deleteTimerRef.current);
      }
    };
  }, [id, imdbId, items.length, onClose, setDraftItem]);

  useEffect(() => {
    if (resort) {
      actions.setSort(items, sort);
    }
  }, [resort, items, sort]);

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
        {error && <p className="Item-error">{error}</p>}
        <div className="Item-buttons">
          <Button variant="contained" color="primary" className="Item-button" onClick={onSave}>
            Save
          </Button>
          <Button variant="contained" color="default" className="Item-button" onClick={onClose}>
            Cancel
          </Button>
          {!isNew && (
            <Button
              variant="contained"
              color="default"
              className={deleteClassName}
              onClick={onDelete}
            >
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
