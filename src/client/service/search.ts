import { Vali, Finished, Type, State, Rating } from "@common/enums";
import { ItemSearchData, ParsedItem, StateInfo } from "@common/types";
import { replaceRomanNumbers } from "./utils";

const reSeasonNumber = /(s\d{2})/i;
const reNonWordChars = /[^\w\s']/g;
const rePunctuation = /[,.?!()-+:;"]+/g;
const reMultiSpace = /\s{2,}/g;
const reCommonWords =
  /\b(the|and|a|an|is|are|to|of|in|for|on|with|that|this|it|its|as|was|were|will|by)\b/gi;

const cleanArray = (array: (string | number)[]) =>
  array.map((item) => (item ?? "").toString().trim().toLowerCase()).filter(Boolean);

const cleanText = (text: string) =>
  text
    .toLowerCase()
    .replace(reNonWordChars, " ")
    .replace(rePunctuation, " ")
    .replace(reMultiSpace, " ")
    .trim();

const removeCommonWords = (text: string) => text.replace(reCommonWords, "");

const getStateSeason = (state: StateInfo) => {
  const stateText = state.parts.join(" ");
  const match = reSeasonNumber.exec(stateText);
  return match ? match[1] : "";
};

export const SearchKeywords = Object.freeze({
  // primary keywords (without prefix)
  ...Type,
  ...State,
  VALI: "vali",
  CSABA: "csaba",
  // secondary keywords (with # prefix)
  UNFINISHED: "#unfinished",
  NOPOSTER: "#noposter",
  NOIMDB: "#noimdb",
  UNSCRAPED: "#unscraped",
  DISLIKE: `#${Rating.DISLIKE}`,
  LIKE: `#${Rating.LIKE}`,
  FAVORITE: `#${Rating.FAVORITE}`,
});

export const itemSearchData = (item: ParsedItem, state: StateInfo): ItemSearchData => ({
  text: cleanArray([
    replaceRomanNumbers(item.title, true),
    cleanText(removeCommonWords(item.notes ?? "")),
    cleanText(removeCommonWords(item.description ?? "")),
    getStateSeason(state),
    item.releaseYear ?? "",
  ]).join(" "),
  starts: cleanArray(item.genres ?? []),
  equals: cleanArray([
    item.type,
    state.type,
    // vali?
    [Vali.YES, Vali.MAYBE].includes(item.withVali ?? Vali.NO) ? SearchKeywords.VALI : "",
    // csaba?
    item.withVali === Vali.NO ? SearchKeywords.CSABA : "",
    // finished?
    [Finished.YES, Finished.QUIT].includes(item.finished ?? Finished.NO)
      ? SearchKeywords.FINISHED
      : SearchKeywords.UNFINISHED,
    // no poster?
    !item.posterUrl ? SearchKeywords.NOPOSTER : "",
    // no imdb?
    !item.imdbId ? SearchKeywords.NOIMDB : "",
    // unscraped?
    item.keywords?.length || item.description?.length ? "" : SearchKeywords.UNSCRAPED,
    // rating?
    !item.rating ? "" : `#${item.rating}`,
    // + all the keywords from imdb
    ...(item.keywords ?? []),
  ]),
});
