import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Poster from "./Poster";
import StateLabel from "./StateLabel";
import { ItemType, FinishedType, StateType, NextType, ValiType } from "../../common/enums";
import { inputDateAddMonth, parseDate, seasonCode, getNextSeasonNum, noop } from "../service/utils";
import { defaultItem } from "../service/serviceUtils";
import "./ItemDetails.css";
import RatingButton from "./RatingButton";

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

class ItemDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: { ...defaultItem },
    };
    this.checkableStates = [StateType.READY, StateType.PROGRESS, StateType.RECHECK];
  }

  componentWillReceiveProps(nextProps) {
    const { item } = nextProps;
    const buttons = this.getButtons(item);
    const links = this.getLinks(item);
    this.setState({
      item: { ...item },
      buttons,
      links,
    });
  }

  onRatingChange = (value) => {
    this.updateItem({ rating: value });
  };

  getButtons(item) {
    const buttons = [];
    const addButton = (label, onClick) => {
      buttons.push(
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
    const isMovie = item.type === ItemType.MOVIE;
    const isWaitingOrRecheck = [StateType.WAITING, StateType.RECHECK].includes(item.state.type);
    const isFinishedOrQuit = [FinishedType.YES, FinishedType.QUIT].includes(item.finished);
    const nextSeasonNum = getNextSeasonNum(item);
    if (isFinishedOrQuit) {
      return [];
    }
    if (isWaitingOrRecheck) {
      const name = isMovie ? "Movie" : seasonCode(nextSeasonNum);
      addButton(`${name} is available now`, () => {
        this.updateItem({
          nextDate: parseDate(new Date()).input,
          nextType: NextType.AVAILABLE,
        });
      });
      addButton("Check a month later", () => {
        const today = parseDate(new Date()).input;
        const date = today > item.nextDate ? today : item.nextDate;
        this.updateItem({ nextDate: inputDateAddMonth(date, 1) });
      });
      if (!isMovie) {
        addButton("Finished the show", () => {
          this.updateItem({
            finished: FinishedType.YES,
            nextDate: "",
            nextType: "",
          });
        });
      }
    }
    if (item.state.type === StateType.READY) {
      const name = isMovie ? "movie" : seasonCode(nextSeasonNum);
      const inProgress = isMovie ? 1 : nextSeasonNum;
      addButton(`Start watching ${name}`, () => {
        this.updateItem({
          inProgress,
          nextDate: "",
          nextType: "",
        });
      });
    }
    if (item.state.type === StateType.PROGRESS) {
      if (isMovie) {
        addButton("Watched the movie", () => {
          this.updateItem({
            finished: FinishedType.YES,
            nextDate: "",
            nextType: "",
          });
        });
      } else {
        addButton(`Finished ${seasonCode(item.inProgress)}`, () => {
          this.updateItem({
            lastWatched: item.inProgress,
            inProgress: "",
            nextDate: parseDate(new Date()).input,
            nextType: NextType.RECHECK,
          });
        });
        addButton("Quit watching show", () => {
          this.updateItem({
            lastWatched: item.inProgress,
            inProgress: "",
            nextDate: "",
            nextType: "",
            finished: FinishedType.QUIT,
          });
        });
      }
    }
    return buttons;
  }

  getLinks(item) {
    const links = [];
    const addLink = (label, url) =>
      links.push(
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
    const isMovie = item.type === ItemType.MOVIE;
    const isFinishedOrQuit = [FinishedType.YES, FinishedType.QUIT].includes(item.finished);
    const inProgress = Boolean(item.inProgress);
    const title = encodeURIComponent(item.title);
    const isCheckable = this.checkableStates.includes(item.state.type);
    const nextSeasonNum = getNextSeasonNum(item);
    const season = isMovie ? "" : ` season ${nextSeasonNum}`;
    // IMDb
    if (item.imdbId) {
      if (["#", "none"].includes(item.imdbId)) {
        addLink("No IMDb");
      } else {
        addLink("IMDb", `http://www.imdb.com/title/${item.imdbId}/?ref_=fn_tv_tt_1`);
      }
    } else {
      const params = isMovie ? "&s=tt&ttype=ft" : "&s=tt&ttype=tv&ref_=fn_tv";
      addLink("IMDb search", `http://www.imdb.com/find?q=${title}${params}`);
    }
    // IMDb next season
    if (item.imdbId && isCheckable && !isMovie) {
      addLink(
        `IMDb ${seasonCode(nextSeasonNum)}`,
        `http://www.imdb.com/title/${item.imdbId}/episodes/?season=${nextSeasonNum}`,
      );
    }
    // Subtitles & Port.hu
    if (isCheckable && item.withVali !== ValiType.NO) {
      addLink("Subtitles", `https://www.feliratok.eu/?search=${title}&nyelv=Magyar`);
      addLink("Port.hu", `https://port.hu/kereso?q=${title}&type=movie`); // always "movie"
    }
    // Torrent
    if (isCheckable) {
      const type = isMovie ? "movies" : "tv";
      const year = isMovie && item.releaseYear ? ` ${item.releaseYear}` : "";
      const query = encodeURIComponent(`${item.title}${season}${year}`);
      addLink("Torrents", `https://www.limetorrents.info/search/${type}/${query}/date/1/`);
    }
    // Youtube recap
    if (!isFinishedOrQuit && !inProgress && !isMovie && item.lastWatched) {
      const query = encodeURIComponent(`${item.title} season ${item.lastWatched} recap`);
      addLink(
        `${seasonCode(item.lastWatched)} recap`,
        `https://www.youtube.com/results?search_query=${query}`,
      );
    }
    // Youtube trailer
    if (!isFinishedOrQuit && !inProgress) {
      const name = isMovie ? "Movie" : `${seasonCode(nextSeasonNum)}`;
      const query = encodeURIComponent(`${item.title}${season} trailer`);
      addLink(`${name} trailer`, `https://www.youtube.com/results?search_query=${query}`);
    }
    // Poster search
    if (!item.posterUrl) {
      const query = encodeURIComponent(`${item.title} ${item.type} poster`);
      addLink("Posters", `https://www.google.hu/search?q=${query}&tbm=isch&tbs=isz:m`);
    }
    return links;
  }

  updateItem(updateFields) {
    const { item } = this.state;
    const { onChange } = this.props;
    onChange({
      ...item,
      ...updateFields,
    });
  }

  render() {
    const { item, buttons, links } = this.state;
    const { visible, onPosterSearch, posterScraping } = this.props;
    const display = visible ? "block" : "none";
    const stateLabel = <StateLabel state={item.state} />;
    return (
      <div className="ItemDetails" style={{ display }}>
        <div className="ItemDetails-grid">
          <div className="ItemDetails-sidebar">
            <Poster item={item} onPosterSearch={onPosterSearch} posterScraping={posterScraping} />
            {buttons}
            <RatingButton value={item.rating} onChange={this.onRatingChange} />
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
  }
}

ItemDetails.propTypes = {
  item: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired,
  onPosterSearch: PropTypes.func,
  posterScraping: PropTypes.bool,
  visible: PropTypes.bool,
};

ItemDetails.defaultProps = {
  visible: true,
  posterScraping: false,
  onPosterSearch: noop,
};

export default ItemDetails;
