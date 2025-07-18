import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import Poster from "./Poster";
import StateLabel from "./StateLabel";
import { ItemType, FinishedType, StateType, NextType, ValiType } from "../../common/enums";
import { inputDateAddMonth, parseDate, seasonCode, getNextSeasonNum, noop } from "../service/utils";
import { defaultItem } from "../service/serviceUtils";
import RatingButton from "./RatingButton";
import "./ItemDetails.css";

const checkableStates = [StateType.READY, StateType.PROGRESS, StateType.RECHECK];

const DetailsRow = ({ label, value, className = "", optional = false }) => {
  if (optional && !value) {
    return null;
  }
  return [
    <div key="label" className={`ItemDetails-label ${className}`}>
      {label}
    </div>,
    <div key="value" className={`ItemDetails-value ${className}`}>
      {value}
    </div>,
  ];
};

DetailsRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  className: PropTypes.string,
  optional: PropTypes.bool,
};

const ItemDetails = ({
  item: propItem,
  onChange,
  onPosterSearch = noop,
  posterScraping = false,
  visible = true,
}) => {
  const [item, setItem] = useState({ ...defaultItem });
  const [buttons, setButtons] = useState([]);
  const [links, setLinks] = useState([]);

  const updateItem = useCallback(
    (updateFields) => {
      onChange({
        ...propItem,
        ...updateFields,
      });
    },
    [onChange, propItem],
  );

  const onRatingChange = (value) => {
    updateItem({ rating: value });
  };

  const getButtons = useCallback(
    (itemData) => {
      const buttonsList = [];
      const addButton = (label, onClick) => {
        buttonsList.push(
          <Button
            key={label}
            variant="contained"
            color="secondary"
            className="ItemDetails-button"
            onClick={onClick}
          >
            {label}
          </Button>,
        );
      };
      const isMovie = itemData.type === ItemType.MOVIE;
      const isWaitingOrRecheck = [StateType.WAITING, StateType.RECHECK].includes(
        itemData.state.type,
      );
      const isFinishedOrQuit = [FinishedType.YES, FinishedType.QUIT].includes(itemData.finished);
      const nextSeasonNum = getNextSeasonNum(itemData);
      if (isFinishedOrQuit) {
        return [];
      }
      if (isWaitingOrRecheck) {
        const name = isMovie ? "Movie" : seasonCode(nextSeasonNum);
        addButton(`${name} is available now`, () => {
          updateItem({
            nextDate: parseDate(new Date()).input,
            nextType: NextType.AVAILABLE,
          });
        });
        addButton("Check a month later", () => {
          const today = parseDate(new Date()).input;
          const date = today > itemData.nextDate ? today : itemData.nextDate;
          updateItem({ nextDate: inputDateAddMonth(date, 1) });
        });
        if (!isMovie) {
          addButton("Finished the show", () => {
            updateItem({
              finished: FinishedType.YES,
              nextDate: "",
              nextType: "",
            });
          });
        }
      }
      if (itemData.state.type === StateType.READY) {
        const name = isMovie ? "movie" : seasonCode(nextSeasonNum);
        const inProgress = isMovie ? 1 : nextSeasonNum;
        addButton(`Start watching ${name}`, () => {
          updateItem({
            inProgress,
            nextDate: "",
            nextType: "",
          });
        });
      }
      if (itemData.state.type === StateType.PROGRESS) {
        if (isMovie) {
          addButton("Watched the movie", () => {
            updateItem({
              finished: FinishedType.YES,
              nextDate: "",
              nextType: "",
            });
          });
        } else {
          addButton(`Finished ${seasonCode(itemData.inProgress)}`, () => {
            updateItem({
              lastWatched: itemData.inProgress,
              inProgress: "",
              nextDate: parseDate(new Date()).input,
              nextType: NextType.RECHECK,
            });
          });
          addButton("Quit watching show", () => {
            updateItem({
              lastWatched: itemData.inProgress,
              inProgress: "",
              nextDate: "",
              nextType: "",
              finished: FinishedType.QUIT,
            });
          });
        }
      }
      return buttonsList;
    },
    [updateItem],
  );

  const getLinks = useCallback((itemData) => {
    const linksList = [];
    const addLink = (label, url) =>
      linksList.push(
        url ? (
          <a key={label} href={url} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        ) : (
          <span key={label} className="nolink">
            {label}
          </span>
        ),
      );
    const isMovie = itemData.type === ItemType.MOVIE;
    const isFinishedOrQuit = [FinishedType.YES, FinishedType.QUIT].includes(itemData.finished);
    const inProgress = Boolean(itemData.inProgress);
    const title = encodeURIComponent(itemData.title);
    const isCheckable = checkableStates.includes(itemData.state.type);
    const isWaiting = itemData.state.type === StateType.WAITING;
    const nextSeasonNum = getNextSeasonNum(itemData);
    const season = isMovie ? "" : ` season ${nextSeasonNum}`;
    const seasonShort = isMovie ? "" : ` s${nextSeasonNum.toString().padStart(2, "0")}`;
    // IMDb
    if (itemData.imdbId) {
      if (["#", "none"].includes(itemData.imdbId)) {
        addLink("No IMDb");
      } else {
        addLink("IMDb", `http://www.imdb.com/title/${itemData.imdbId}/?ref_=fn_tv_tt_1`);
      }
    } else {
      const params = isMovie ? "&s=tt&ttype=ft" : "&s=tt&ttype=tv&ref_=fn_tv";
      addLink("IMDb search", `http://www.imdb.com/find?q=${title}${params}`);
    }
    // IMDb next season
    if (itemData.imdbId && isCheckable && !isMovie) {
      addLink(
        `IMDb ${seasonCode(nextSeasonNum)}`,
        `http://www.imdb.com/title/${itemData.imdbId}/episodes/?season=${nextSeasonNum}`,
      );
    }
    // Subtitles & Port.hu
    if (isCheckable && itemData.withVali !== ValiType.NO) {
      addLink("Subtitles", `https://www.feliratok.eu/?search=${title}&nyelv=Magyar`);
      addLink("Port.hu", `https://port.hu/kereso?q=${title}&type=movie`); // always "movie"
    }
    // Torrent
    if (isCheckable || isWaiting) {
      const type = isMovie ? "movies" : "tv";
      const year = isMovie && itemData.releaseYear ? ` ${itemData.releaseYear}` : "";
      const query = encodeURIComponent(`${itemData.title}${seasonShort}${year}`);
      addLink("Torrents", `https://www.limetorrents.info/search/${type}/${query}/date/1/`);
    }
    // Youtube recap
    if (!isFinishedOrQuit && !inProgress && !isMovie && itemData.lastWatched) {
      const query = encodeURIComponent(`${itemData.title} season ${itemData.lastWatched} recap`);
      addLink(
        `${seasonCode(itemData.lastWatched)} recap`,
        `https://www.youtube.com/results?search_query=${query}`,
      );
    }
    // Youtube trailer
    if (!isFinishedOrQuit && !inProgress) {
      const name = isMovie ? "Movie" : `${seasonCode(nextSeasonNum)}`;
      const query = encodeURIComponent(`${itemData.title}${season} trailer`);
      addLink(`${name} trailer`, `https://www.youtube.com/results?search_query=${query}`);
    }
    // Poster search
    if (!itemData.posterUrl) {
      const query = encodeURIComponent(`${itemData.title} ${itemData.type} poster`);
      addLink("Posters", `https://www.google.hu/search?q=${query}&tbm=isch&tbs=isz:m`);
    }
    return linksList;
  }, []);

  useEffect(() => {
    const newButtons = getButtons(propItem);
    const newLinks = getLinks(propItem);
    setItem({ ...propItem });
    setButtons(newButtons);
    setLinks(newLinks);
  }, [propItem, getButtons, getLinks]);

  const display = visible ? "block" : "none";
  const stateLabel = <StateLabel state={item.state} />;

  return (
    <div className="ItemDetails" style={{ display }}>
      <div className="ItemDetails-grid">
        <div className="ItemDetails-sidebar">
          <Poster item={item} onPosterSearch={onPosterSearch} posterScraping={posterScraping} />
          {buttons}
          <RatingButton value={item.rating} onChange={onRatingChange} />
        </div>
        <div className="ItemDetails-fields">
          <DetailsRow label="Title" value={item.title} className="ItemDetails-title" />
          <DetailsRow label="State" value={stateLabel} className="ItemDetails-state" />
          <DetailsRow label="Type" value={item.type} />
          <DetailsRow label="Genre" value={item.genres.join(", ") || "Unkown"} />
          <DetailsRow label="Description" value={item.description} optional />
          <DetailsRow label="Keywords" value={item.keywords.join(", ")} optional />
          <DetailsRow label="Notes" value={item.notes} optional />
          <DetailsRow label="With Vali" value={item.withVali} />
          <DetailsRow label="Links" value={links} className="ItemDetails-links" />
        </div>
      </div>
    </div>
  );
};

ItemDetails.propTypes = {
  item: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired,
  onPosterSearch: PropTypes.func,
  posterScraping: PropTypes.bool,
  visible: PropTypes.bool,
};

export default ItemDetails;
