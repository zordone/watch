import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import { noop } from "lodash";
import * as service from "../service/service";
import { ItemType, ValiType, NextType, FinishedType, Const, RatingType } from "../../common/enums";
import SelectField from "./SelectField";
import ChipField from "./ChipField";
import { parseDate, mergeArrays } from "../service/utils";
import { defaultItem } from "../service/serviceUtils";
import events, { Events } from "../service/events";
import ScrapeButton from "./ScrapeButton";
import { useDebouncedCallback } from "../hooks/useDebouncedCallback";
import data from "../../common/data.json";
import "./ItemForm.css";

const MAX_GENRES = 4;
const MAX_KEYWORDS = 10;

const ItemForm = ({ item: propItem, onChange, findByTitle = noop, visible = true }) => {
  const [item, setItem] = useState({ ...defaultItem });
  const [sameTitle, setSameTitle] = useState(undefined);
  const [imdbScraping, setImdbScraping] = useState(false);

  const sameTitleLinkRef = useRef();
  const seasonSlotProps = { htmlInput: { min: "1", max: "99" } };
  const releaseYearSlotProps = { htmlInput: { min: "1900", max: "2100" } };

  useEffect(() => {
    setItem({ ...propItem });
  }, [propItem]);

  const onTitleChangeDebounced = useDebouncedCallback(
    useCallback(() => {
      const other = findByTitle(item._id, item.title);
      if (other !== sameTitle) {
        const { _id: id, title } = other || {};
        if (id) {
          sameTitleLinkRef.current = (
            <a href={`/item/${id}`} target="_blank" rel="noopener noreferrer">
              {title}
            </a>
          );
        }
        setSameTitle(other);
      }
    }, [findByTitle, item._id, item.title, sameTitle]),
    500,
  );

  const onFieldChange = (event) => {
    const { id, value } = event.target;
    const newItem = {
      ...item,
      [id]: value,
    };
    setItem(newItem);
    onChange(newItem);
    if (item.title !== newItem.title) {
      onTitleChangeDebounced();
    }
  };

  const onDateKeyDown = (event) => {
    if (event.key.toLowerCase() === "t") {
      const { id } = event.target;
      const value = parseDate(new Date()).input;
      onFieldChange({ target: { id, value } });
    }
  };

  const onImdbScrape = useCallback(() => {
    setImdbScraping(true);
    service
      .imdbData(item.imdbId)
      .then((data) => {
        console.debug("IMDb data", data);
        const parsed = data.parsed || {};
        const newItem = {
          ...item,
          type: parsed.type || item.type,
          title: parsed.title || item.title,
          genres: mergeArrays(parsed.genres, item.genres),
          description: parsed.description || item.description,
          keywords: mergeArrays(parsed.keywords, item.keywords),
          posterUrl: parsed.posterUrl || item.posterUrl,
          released: parsed.released || item.released,
          releaseYear: parsed.releaseYear || item.releaseYear,
        };
        if (newItem.genres.length > MAX_GENRES) {
          newItem.genres = newItem.genres.slice(0, MAX_GENRES);
        }
        const fillNextDate = !newItem.nextDate && !newItem.lastWatched && !newItem.input;
        if (fillNextDate) {
          newItem.nextDate = parsed.released;
          newItem.nextType = newItem.type === ItemType.MOVIE ? NextType.RELEASE : NextType.START;
        }
        setItem(newItem);
        setImdbScraping(false);
        onChange(newItem);
        onTitleChangeDebounced();
      })
      .catch((err) => {
        setImdbScraping(false);
        throw err;
      });
  }, [item, onTitleChangeDebounced, onChange]);

  useEffect(() => {
    events.addListener(Events.IMDB_SCRAPE, onImdbScrape);
    return () => {
      events.removeListener(Events.IMDB_SCRAPE, onImdbScrape);
    };
  }, [onImdbScrape]);

  useEffect(() => {
    const isNew = item._id === Const.NEW;
    const hasTitle = Boolean(item.title);
    const hasImdb = Boolean(item.imdbId);
    if (isNew && !hasTitle && hasImdb && !imdbScraping) {
      onImdbScrape();
    }
  }, [item._id, item.title, item.imdbId, imdbScraping, onImdbScrape]);

  const formStyle = {
    display: visible ? "block" : "none",
  };

  return (
    <form noValidate autoComplete="off" className="ItemForm" style={formStyle}>
      <div className="ItemForm-grid">
        <div className="title">
          <TextField
            id="title"
            label="Title"
            className="title-field"
            onChange={onFieldChange}
            value={item.title}
            fullWidth
            autoFocus
          />
          <div className={`same-title ${sameTitle ? "show" : ""}`}>
            This title is already taken by: {sameTitleLinkRef.current}
          </div>
        </div>
        <SelectField
          id="type"
          className="type"
          label="Type"
          onChange={onFieldChange}
          value={item.type}
          options={Object.values(ItemType)}
        />
        <ChipField
          id="genres"
          className="genres"
          label="Genres"
          onChange={onFieldChange}
          options={data.genres}
          value={item.genres}
          maxChips={MAX_GENRES}
        />
        <SelectField
          id="withVali"
          className="vali"
          label="With Vali"
          onChange={onFieldChange}
          value={item.withVali}
          options={Object.values(ValiType)}
        />
        <TextField
          id="lastWatched"
          className="last"
          label="Last watched"
          type="number"
          slotProps={seasonSlotProps}
          onChange={onFieldChange}
          value={item.lastWatched}
        />
        <TextField
          id="inProgress"
          className="progress"
          label="In progress"
          type="number"
          slotProps={seasonSlotProps}
          onChange={onFieldChange}
          value={item.inProgress}
        />
        <TextField
          id="nextDate"
          className={`ndate ${item.nextDate ? "" : "ItemForm-empty"}`}
          label="Next date"
          type="date"
          onChange={onFieldChange}
          value={item.nextDate}
          onKeyDown={onDateKeyDown}
        />
        <SelectField
          id="nextType"
          className="ntype"
          label="Next type"
          onChange={onFieldChange}
          value={item.nextType}
          options={Object.values(NextType)}
        />
        <SelectField
          id="finished"
          className="finished"
          label="Finished"
          onChange={onFieldChange}
          value={item.finished}
          options={Object.values(FinishedType)}
        />
        <TextField
          id="description"
          className="descr"
          label="Description"
          onChange={onFieldChange}
          value={item.description}
          multiline
        />
        <ChipField
          id="keywords"
          className="keyw"
          label="Keywords"
          onChange={onFieldChange}
          value={item.keywords}
          maxChips={MAX_KEYWORDS}
        />
        <TextField
          id="notes"
          className="notes"
          label="Notes"
          onChange={onFieldChange}
          value={item.notes}
        />
        <div className="imdb">
          <TextField id="imdbId" label="IMDb ID" onChange={onFieldChange} value={item.imdbId} />
          <ScrapeButton
            className="imdb-scrape"
            ariaLabel="Fill from IMDb"
            visible={Boolean(item.imdbId)}
            inProgress={imdbScraping}
            onClick={onImdbScrape}
          />
        </div>
        <TextField
          id="posterUrl"
          className="poster"
          label="Poster URL"
          onChange={onFieldChange}
          value={item.posterUrl}
        />
        <TextField
          id="releaseYear"
          className="relyr"
          label="Release year"
          type="number"
          slotProps={releaseYearSlotProps}
          onChange={onFieldChange}
          value={item.releaseYear}
        />
        <SelectField
          id="rating"
          className="ratin"
          label="Rating"
          onChange={onFieldChange}
          value={item.rating}
          options={Object.values(RatingType)}
        />
      </div>
    </form>
  );
};

ItemForm.propTypes = {
  item: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired,
  findByTitle: PropTypes.func,
  visible: PropTypes.bool,
};

export default ItemForm;
