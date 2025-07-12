import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button, IconButton, Paper } from "@mui/material";
import { Create, Check, DeleteForever } from "@mui/icons-material";
import * as service from "../service/service";
import { useStore, actions } from "../store/store";
import ItemForm from "./ItemForm";
import ItemDetails from "./ItemDetails";
import itemState from "../service/itemState";
import { slugify } from "../service/utils";
import { defaultItem } from "../service/serviceUtils";
import PosterSearch from "./PosterSearch";
import Spinner from "./Spinner";
import { Const } from "../../common/enums";
import events, { Events } from "../service/events";
import "./Item.css";
import { useGoBackOrHome } from "../hooks/useGoBackOrHome";

const FORM = "form";
const DETAILS = "details";

const Item = () => {
  const store = useStore();
  const { items, sort, resort } = store;

  const onClose = useGoBackOrHome();
  const match = { params: useParams() };
  const [item, setItem] = useState({
    ...defaultItem,
    isDefaultItem: true,
  });
  const [page, setPage] = useState(DETAILS);
  const [posters, setPosters] = useState({
    visible: false,
    searching: false,
    images: [],
  });
  const [posterScraping, setPosterScraping] = useState(false);
  const [error, setError] = useState("");
  const [deleteSure, setDeleteSure] = useState(false);

  const deleteTimerRef = useRef();

  const updateItemState = (changedItem, updateState = false) => {
    setItem({
      ...changedItem,
      state: updateState ? itemState(changedItem) : changedItem.state,
    });
  };

  const onChange = (changedItem) => {
    const updateState = page === DETAILS;
    updateItemState(changedItem, updateState);
  };

  const onSave = () => {
    const isNew = item._id === Const.NEW;
    const promise = isNew ? service.saveNewItem(item) : service.updateItemById(item._id, item);
    promise
      .then((saved) => {
        setItem(saved);
        if (isNew) {
          actions.addNewItem(saved);
        }
        actions.updateItem(items, saved);
        onClose();
        actions.setSnack(true, "Item updated.");
        actions.setCurrentId(saved._id);
      })
      .catch((err) => {
        console.error("Updating item failed.", err);
        setError(err.message);
      });
  };

  const onShowForm = () => {
    setPage(FORM);
  };

  const onShowDetails = () => {
    setPage(DETAILS);
    updateItemState(item, true);
  };

  const onPosterSearch = () => {
    setPosters({ visible: true, searching: true, images: [] });
    setPosterScraping(true);
    const query = encodeURI(`${item.title} ${item.type} poster`);
    service
      .searchImages(query)
      .then((images) => {
        setPosters({ visible: true, searching: false, images });
        setPosterScraping(false);
      })
      .catch((err) => {
        setPosterScraping(false);
        throw err;
      });
  };

  const onPosterSelect = (url) => {
    if (url) {
      onChange({ ...item, posterUrl: url });
    }
    setPosters({ visible: false, searching: false, images: [] });
  };

  const onDelete = () => {
    if (deleteSure) {
      clearTimeout(deleteTimerRef.current);
      service
        .deleteItemById(item._id)
        .then(() => {
          actions.deleteItem(items, item._id);
          setError("");
          setDeleteSure(false);
          onClose();
          actions.setSnack(true, "Item deleted.");
        })
        .catch((err) => {
          console.error("Updating item failed.", err);
          setError(err.message);
          setDeleteSure(false);
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
    const { id, imdbId } = match.params;
    if (id === Const.NEW) {
      const newItem = service.createNewItem();
      if (id === Const.NEW && imdbId) {
        newItem.imdbId = imdbId;
      }
      setItem(newItem);
      setPage(FORM);
    } else {
      service.getItemById(id).then((fetchedItem) => {
        setItem(fetchedItem);
      });
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

    // pre-fetch items in case we reloaded the app on this page
    const isFetched = Boolean(items.length);
    if (!isFetched) {
      actions.fetchItems().then(() => {
        actions.setCurrentId(id);
      });
    }

    return () => {
      events.removeListener(Events.KEYUP, onKeyUp);
      if (deleteTimerRef.current) {
        clearTimeout(deleteTimerRef.current);
      }
    };
  }, [match.params, items.length, onClose]);

  useEffect(() => {
    if (resort) {
      actions.setSort(items, sort);
    }
  }, [resort, items, sort]);

  const isNew = item._id === Const.NEW;
  const deleteClassName = `Item-button delete${deleteSure ? " sure" : ""}`;
  const isFullyFetched = item && !item.isDefaultItem;

  return (
    <div className="Item">
      <Paper className="Item-paper">
        <ItemDetails
          item={item}
          onChange={onChange}
          visible={page === DETAILS}
          onPosterSearch={onPosterSearch}
          posterScraping={posterScraping}
        />
        <ItemForm
          item={item}
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
      {!isFullyFetched && <Spinner />}
    </div>
  );
};

export default Item;
