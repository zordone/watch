import { Button } from "@mui/material";
import { useCallback } from "react";
import { Type, Finished, State, Next, Vali, Rating } from "@common/enums";
import { ParsedItem } from "@common/types";
import {
  inputDateAddMonth,
  parseDate,
  seasonCode,
  getNextSeasonNum,
  noop,
  getImdbState,
} from "../service/utils";
import { Poster } from "./Poster";
import { RatingButton } from "./RatingButton";
import { StateLabel } from "./StateLabel";
import "./ItemDetails.css";

interface RowProps {
  label: string;
  children?: React.ReactNode;
  className?: string;
  optional?: boolean;
}

const Row = ({ label, children, className = "", optional = false }: RowProps) => {
  if (optional && !children) {
    return null;
  }
  return (
    <>
      <label className={`ItemDetails-label ${className}`}>{label}</label>
      <div key="value" className={`ItemDetails-value ${className}`}>
        {children}
      </div>
    </>
  );
};

interface LinkProps {
  label: string;
  url?: string;
}

const Link = ({ label, url }: LinkProps) => {
  return url ? (
    <a key={label} href={url} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  ) : (
    <span key={label} className="nolink">
      {label}
    </span>
  );
};

interface SideButtonProps {
  label: string;
  onClick: () => void;
}

const SideButton = ({ label, onClick }: SideButtonProps) => (
  <Button
    key={label}
    variant="contained"
    color="warning"
    className="ItemDetails-button"
    onClick={onClick}
  >
    {label}
  </Button>
);

interface ItemDetailsProps {
  item: ParsedItem;
  onChange: (item: ParsedItem) => void;
  onPosterSearch?: () => void;
  posterSearching?: boolean;
  visible?: boolean;
}

export const ItemDetails = ({
  // draft item
  item,
  onChange,
  onPosterSearch = noop,
  posterSearching = false,
  visible = true,
}: ItemDetailsProps) => {
  const state = item.state.type;
  const imdbState = getImdbState(item.imdbId);
  const inProgress = Boolean(item.inProgress);
  const nextSeasonNum = getNextSeasonNum(item);
  const isFinishedOrQuit = [Finished.YES, Finished.QUIT].includes(item.finished);
  const isWaitingOrRecheck = [State.WAITING, State.RECHECK].includes(state);
  const isCheckable = [State.READY, State.PROGRESS, State.RECHECK].includes(state);
  const isWaiting = state === State.WAITING;
  const isMovie = item.type === Type.MOVIE;
  const typeName = isMovie ? "Movie" : seasonCode(nextSeasonNum);
  const nextInProgress = isMovie ? 1 : nextSeasonNum;
  const season = isMovie ? "" : ` season ${nextSeasonNum}`;
  const seasonShort = isMovie ? "" : ` s${(nextSeasonNum ?? "").toString().padStart(2, "0")}`;
  const isSubtitled = isCheckable && item.withVali !== Vali.NO;
  const torrentVisible = isCheckable || isWaiting;
  const torrentType = isMovie ? "movies" : "tv";
  const torrentYear = isMovie && item.releaseYear ? ` ${item.releaseYear}` : "";
  const torrentQuery = encodeURIComponent(`${item.title}${seasonShort}${torrentYear}`);
  const posterQuery = encodeURIComponent(`${item.title} ${item.type} poster`);
  const recapQuery = encodeURIComponent(`${item.title} season ${item.lastWatched} recap`);
  const trailerQuery = encodeURIComponent(`${item.title}${season} trailer`);
  const titleQuery = encodeURIComponent(item.title);

  const updateItem = useCallback(
    (updateFields: Partial<ParsedItem>) => {
      onChange({
        ...item,
        ...updateFields,
      });
    },
    [onChange, item],
  );

  const onRatingChange = useCallback(
    (value: Rating) => {
      updateItem({ rating: value });
    },
    [updateItem],
  );

  const availableNow = useCallback(
    () =>
      updateItem({
        nextDate: parseDate(new Date()).input,
        nextType: Next.AVAILABLE,
      }),
    [updateItem],
  );

  const checkLater = useCallback(() => {
    const today = parseDate(new Date()).input;
    const date = today > item.nextDate ? today : item.nextDate;
    updateItem({ nextDate: inputDateAddMonth(date, 1) });
  }, [updateItem, item.nextDate]);

  const finishedShow = useCallback(
    () => updateItem({ finished: Finished.YES, nextDate: "", nextType: Next.EMPTY }),
    [updateItem],
  );

  const startWatching = useCallback(
    () =>
      updateItem({ inProgress: String(nextInProgress ?? ""), nextDate: "", nextType: Next.EMPTY }),
    [updateItem, nextInProgress],
  );

  const watchedMovie = useCallback(
    () => updateItem({ finished: Finished.YES, nextDate: "", nextType: Next.EMPTY }),
    [updateItem],
  );

  const finishedSeason = useCallback(
    () =>
      updateItem({
        lastWatched: item.inProgress,
        inProgress: "",
        nextDate: parseDate(new Date()).input,
        nextType: Next.RECHECK,
      }),
    [updateItem, item.inProgress],
  );

  const quitWatching = useCallback(
    () =>
      updateItem({
        lastWatched: item.inProgress,
        inProgress: "",
        nextDate: "",
        nextType: Next.EMPTY,
        finished: Finished.QUIT,
      }),
    [updateItem, item.inProgress],
  );

  return (
    <div className="ItemDetails" style={{ display: visible ? "block" : "none" }}>
      <div className="ItemDetails-grid">
        <div className="ItemDetails-sidebar">
          <Poster item={item} onPosterSearch={onPosterSearch} posterSearching={posterSearching} />
          {!isFinishedOrQuit && (
            <div className="ItemDetails-sidebar-buttons">
              {isWaitingOrRecheck && (
                <>
                  <SideButton label={`${typeName} is available now`} onClick={availableNow} />
                  <SideButton label="Check a month later" onClick={checkLater} />
                </>
              )}
              {isWaitingOrRecheck && !isMovie && (
                <SideButton label="Finished the show" onClick={finishedShow} />
              )}
              {state === State.READY && (
                <SideButton
                  label={`Start watching ${typeName.toLowerCase()}`}
                  onClick={startWatching}
                />
              )}
              {isMovie && state === State.PROGRESS && (
                <SideButton label="Watched the movie" onClick={watchedMovie} />
              )}
              {!isMovie && state === State.PROGRESS && (
                <>
                  <SideButton
                    label={`Finished ${seasonCode(item.inProgress)}`}
                    onClick={finishedSeason}
                  />
                  <SideButton label="Quit watching show" onClick={quitWatching} />
                </>
              )}
            </div>
          )}
          <RatingButton value={item.rating} onChange={onRatingChange} />
        </div>
        <div className="ItemDetails-fields">
          <Row label="Title" className="ItemDetails-title">
            {item.title}
          </Row>
          <Row label="State" className="ItemDetails-state">
            <StateLabel item={item} />
          </Row>
          <Row label="Type">{item.type}</Row>
          <Row label="Genre">{item.genres.join(", ") || "Unkown"}</Row>
          <Row label="Description" optional>
            {item.description}
          </Row>
          <Row label="Keywords" optional>
            {item.keywords.join(", ")}
          </Row>
          <Row label="Notes" optional>
            {item.notes}
          </Row>
          <Row label="With Vali">{item.withVali}</Row>
          <Row label="Links" optional>
            {imdbState === "valid" && (
              <Link
                label="IMDb"
                url={`https://www.imdb.com/title/${item.imdbId}/?ref_=fn_tv_tt_1`}
              />
            )}
            {imdbState === "none" && <Link label="No IMDb" />}
            {imdbState === "empty" && (
              <Link label="IMDb search" url={`https://www.imdb.com/find?q=${titleQuery}`} />
            )}
            {imdbState === "valid" && !isMovie && (
              <Link
                label={`IMDb ${seasonCode(nextSeasonNum)}`}
                url={`https://www.imdb.com/title/${item.imdbId}/episodes/?season=${nextSeasonNum}`}
              />
            )}
            {isSubtitled && (
              <Link
                label="Subtitles"
                url={`https://www.feliratok.eu/?search=${titleQuery}&nyelv=Magyar`}
              />
            )}
            {isSubtitled && (
              <Link label="Port.hu" url={`https://port.hu/kereso?q=${titleQuery}&type=movie`} />
            )}
            {torrentVisible && (
              <Link
                label="Torrents"
                url={`https://www.limetorrents.info/search/${torrentType}/${torrentQuery}/date/1/`}
              />
            )}
            {!isFinishedOrQuit && !inProgress && !isMovie && item.lastWatched && (
              <Link
                label={`${seasonCode(item.lastWatched)} recap`}
                url={`https://www.youtube.com/results?search_query=${recapQuery}`}
              />
            )}
            {!isFinishedOrQuit && !inProgress && (
              <Link
                label={`${isMovie ? "Movie" : seasonCode(nextSeasonNum)} trailer`}
                url={`https://www.youtube.com/results?search_query=${trailerQuery}`}
              />
            )}
            {!item.posterUrl && (
              <Link
                label="Posters"
                url={`https://www.google.hu/search?q=${posterQuery}&tbm=isch&tbs=isz:m`}
              />
            )}
          </Row>
        </div>
      </div>
    </div>
  );
};
