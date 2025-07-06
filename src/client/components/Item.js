import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Create from "@material-ui/icons/Create";
import Check from "@material-ui/icons/Check";
import DeleteForever from "@material-ui/icons/DeleteForever";
import * as service from "../service/service";
import * as actions from "../redux/actions";
import * as selectors from "../redux/selectors";
import ItemForm from "./ItemForm";
import ItemDetails from "./ItemDetails";
import itemState from "../service/itemState";
import { slugify, noop } from "../service/utils";
import { defaultItem } from "../service/serviceUtils";
import PosterSearch from "./PosterSearch";
import Spinner from "./Spinner";
import { Const, SortComparators } from "../../common/enums";
import events, { Events } from "../service/events";
import "./Item.css";
import { useGoBackOrHome } from "../hooks/useGoBackOrHome";

const FORM = "form";
const DETAILS = "details";

const Item = ({
  items,
  sort,
  resort,
  addNewItem,
  updateItem,
  deleteItem,
  fetchItems,
  setFirstLoad,
  setCurrentId,
  setSort,
  setSnack,
}) => {
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
          addNewItem(saved);
        }
        updateItem(items, saved);
        onClose();
        setSnack(true, "Item updated.");
        setCurrentId(saved._id);
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
          deleteItem(items, item._id);
          setError("");
          setDeleteSure(false);
          onClose();
          setSnack(true, "Item deleted.");
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
      fetchItems().then(() => {
        setFirstLoad(false);
        setCurrentId(id);
      });
    }

    return () => {
      events.removeListener(Events.KEYUP, onKeyUp);
      if (deleteTimerRef.current) {
        clearTimeout(deleteTimerRef.current);
      }
    };
  }, [match.params, items.length, fetchItems, setFirstLoad, setCurrentId, onClose]);

  useEffect(() => {
    if (resort) {
      setSort(items, sort);
    }
  }, [resort, items, sort, setSort]);
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

Item.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  sort: PropTypes.oneOf(Object.values(SortComparators)),
  resort: PropTypes.bool,
  addNewItem: PropTypes.func,
  updateItem: PropTypes.func,
  deleteItem: PropTypes.func,
  setFirstLoad: PropTypes.func,
  setCurrentId: PropTypes.func,
  setSort: PropTypes.func,
  fetchItems: PropTypes.func,
  setSnack: PropTypes.func,
};

Item.defaultProps = {
  sort: PropTypes.oneOf(Object.values(SortComparators)),
  resort: false,
  addNewItem: noop,
  updateItem: noop,
  deleteItem: noop,
  setFirstLoad: noop,
  setCurrentId: noop,
  setSort: noop,
  fetchItems: noop,
  setSnack: noop,
};

const mapStateToProps = (state) => ({
  items: selectors.getItems(state),
  sort: selectors.getSort(state),
  resort: selectors.getResort(state),
});

const mapDispatchToProps = (dispatch) => ({
  fetchItems: () => dispatch(actions.fetchItems()),
  addNewItem: (item) => dispatch(actions.addNewItem(item)),
  updateItem: (items, item) => dispatch(actions.updateItem(items, item)),
  deleteItem: (items, id) => dispatch(actions.deleteItem(items, id)),
  setFirstLoad: (firstLoad) => dispatch(actions.setFirstLoad(firstLoad)),
  setCurrentId: (currentId) => dispatch(actions.setCurrentId(currentId)),
  setSort: (items, sort) => dispatch(actions.setSort(items, sort)),
  setSnack: (open, text) => dispatch(actions.setSnack(open, text)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Item);
