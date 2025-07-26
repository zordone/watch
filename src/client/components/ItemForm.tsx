import { TextField } from "@mui/material";
import { useState, useEffect, useRef, useCallback } from "react";
import { Type, Vali, Next, Finished, Rating, ItemLoadingFlag, Genre } from "@common/enums";
import { ParsedItem } from "@common/types";
import { useDebouncedCallback } from "../hooks/useDebouncedCallback";
import { imdbData, NEW_ID } from "../service/service";
import { parseDate, mergeArrays, emptyToNull } from "../service/utils";
import { actions } from "../store/store";
import { ChipField } from "./ChipField";
import { ScrapeButton } from "./ScrapeButton";
import { SelectField } from "./SelectField";
import "./ItemForm.css";

const MAX_GENRES = 4;
const MAX_KEYWORDS = 10;

const seasonSlotProps = { htmlInput: { min: "1", max: "99" } };
const releaseYearSlotProps = { htmlInput: { min: "1900", max: "2100" } };

interface ItemFormProps {
  item: ParsedItem;
  visible?: boolean;
  onChange: (item: ParsedItem) => void;
  findByTitle: (id: string, title: string) => ParsedItem | undefined;
}

export const ItemForm = ({
  // draft item
  item,
  visible = true,
  onChange,
  findByTitle,
}: ItemFormProps) => {
  const [same, setSame] = useState<ParsedItem | undefined>(undefined);
  const imdbScrapingRef = useRef(false);
  const imdbAutoScrapeDoneRef = useRef(false);

  const onTitleChangeDebounced = useDebouncedCallback(
    useCallback(() => {
      const other = findByTitle(item._id, item.title);
      if (other !== same) {
        setSame(other);
      }
    }, [findByTitle, item._id, item.title, same]),
    500,
  );

  // update a field behind a controlled input. different kind of inputs have
  // different kinds of onChange handlers, but they all call this at the end
  const updateField = useCallback(
    (id: string, value: string | string[] | number, type?: string) => {
      // convert string from a number input to a number
      if (type === "number" && typeof value === "string" && value) {
        value = parseInt(value, 10);
      }
      const newItem = {
        ...item,
        [id]: value,
      };
      onChange(newItem);
      if (item.title !== newItem.title) {
        onTitleChangeDebounced();
      }
    },
    [item, onChange, onTitleChangeDebounced],
  );

  const onFieldChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value, type } = event.target;
      updateField(id, value, type);
    },
    [updateField],
  );

  const onChipFieldChange = useCallback(
    (id: string, value: string[]) => {
      updateField(id, value);
    },
    [updateField],
  );

  const onDateFieldKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key.toLowerCase() === "t") {
        const { id } = event.currentTarget;
        const value = parseDate(new Date()).input;
        updateField(id, value, "date");
      }
    },
    [updateField],
  );

  const onImdbScrape = useCallback(() => {
    if (imdbScrapingRef.current || !item.imdbId) return;
    imdbScrapingRef.current = true;
    actions.setItemLoadingFlag(ItemLoadingFlag.IMDB_SCRAPE, true);
    imdbData(item.imdbId)
      .then((data) => {
        console.debug("IMDb data", data);
        const parsed = data.parsed ?? {};
        const newItem: ParsedItem = {
          ...item,
          type: emptyToNull(parsed.type) ?? item.type,
          title: emptyToNull(parsed.title) ?? item.title,
          genres: mergeArrays(parsed.genres, item.genres),
          description: emptyToNull(parsed.description) ?? item.description,
          keywords: mergeArrays(parsed.keywords, item.keywords),
          posterUrl: emptyToNull(parsed.posterUrl) ?? item.posterUrl,
          releaseYear: String(emptyToNull(parsed.releaseYear) ?? item.releaseYear),
        };
        if (newItem.genres.length > MAX_GENRES) {
          newItem.genres = newItem.genres.slice(0, MAX_GENRES);
        }
        const fillNextDate = !newItem.nextDate && !newItem.lastWatched;
        if (fillNextDate) {
          newItem.nextDate = parsed.released;
          newItem.nextType = newItem.type === Type.MOVIE ? Next.RELEASE : Next.START;
        }
        onChange(newItem);
        onTitleChangeDebounced();
      })
      .catch((err) => {
        console.error(err);
        actions.showSnack("Failed to scrape IMDb data.", "error");
      })
      .finally(() => {
        imdbScrapingRef.current = false;
        actions.setItemLoadingFlag(ItemLoadingFlag.IMDB_SCRAPE, false);
      });
  }, [item, onChange, onTitleChangeDebounced]);

  // add/remove listener for the IMDb scrape keyboard shortcut event
  useEffect(() => {
    document.addEventListener("imdbScrape", onImdbScrape);
    return () => {
      document.removeEventListener("imdbScrape", onImdbScrape);
    };
  }, [onImdbScrape]);

  // call imdb scrape automatically if it's a new item with imdb ID
  useEffect(() => {
    const isNew = item._id === NEW_ID;
    const hasTitle = Boolean(item.title);
    const hasImdb = Boolean(item.imdbId);
    if (
      isNew &&
      !hasTitle &&
      hasImdb &&
      !imdbAutoScrapeDoneRef.current &&
      !imdbScrapingRef.current
    ) {
      onImdbScrape();
      imdbAutoScrapeDoneRef.current = true;
    }
  }, [item._id, item.title, item.imdbId, onImdbScrape]);

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
          <div className={`same-title ${same ? "show" : ""}`}>
            {same && (
              <>
                This title is already taken by:
                <a href={`/item/${same?._id}`} target="_blank" rel="noopener noreferrer">
                  {same?.title}
                </a>
              </>
            )}
          </div>
        </div>
        <SelectField
          id="type"
          className="type"
          label="Type"
          onChange={onFieldChange}
          value={item.type}
          options={Object.values(Type)}
        />
        <ChipField
          id="genres"
          className="genres"
          label="Genres"
          onChange={onChipFieldChange}
          options={Object.values(Genre)}
          value={item.genres}
          maxChips={MAX_GENRES}
        />
        <SelectField
          id="withVali"
          className="vali"
          label="With Vali"
          onChange={onFieldChange}
          value={item.withVali}
          options={Object.values(Vali)}
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
          onKeyDown={onDateFieldKeyDown}
        />
        <SelectField
          id="nextType"
          className="ntype"
          label="Next type"
          onChange={onFieldChange}
          value={item.nextType}
          options={Object.values(Next)}
        />
        <SelectField
          id="finished"
          className="finished"
          label="Finished"
          onChange={onFieldChange}
          value={item.finished}
          options={Object.values(Finished)}
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
          onChange={onChipFieldChange}
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
            inProgress={imdbScrapingRef.current}
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
          options={Object.values(Rating)}
        />
      </div>
    </form>
  );
};
