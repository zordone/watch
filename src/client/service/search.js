import { ValiType, FinishedType, SearchKeywords } from "../../common/enums";
import { replaceRomanNumbers } from "./utils";

const reNonWordChars = /[^\w\s']/g;
const rePunctuation = /[,.?!()-+:;"]+/g;
const reMultiSpace = /\s{2,}/g;
const reCommonWords =
  /\b(the|and|a|an|is|are|to|of|in|for|on|with|that|this|it|its|as|was|were|will|by)\b/gi;

const cleanArray = (array) =>
  array.map((item) => (item || "").toString().trim().toLowerCase()).filter(Boolean);

const cleanText = (text) =>
  text
    .toLowerCase()
    .replace(reNonWordChars, " ")
    .replace(rePunctuation, " ")
    .replace(reMultiSpace, " ")
    .trim();

const removeCommonWords = (text) => text.replace(reCommonWords, "");

const getStateSeason = (state) => {
  const stateText = state.parts.join(" ");
  const match = stateText.match(/(s\d{2})/i);
  return match ? match[1] : "";
};

export const itemSearchData = (item, state) => ({
  text: cleanArray([
    replaceRomanNumbers(item.title, true),
    cleanText(removeCommonWords(item.notes)),
    cleanText(removeCommonWords(item.description)),
    getStateSeason(state),
    item.releaseYear,
  ]).join(" "),
  starts: cleanArray(item.genres),
  equals: cleanArray([
    item.type,
    state.type,
    // vali?
    [ValiType.YES, ValiType.MAYBE].includes(item.withVali) ? SearchKeywords.VALI : "",
    // csaba?
    item.withVali === ValiType.NO ? SearchKeywords.CSABA : "",
    // finished?
    item.finished === FinishedType.YES ? SearchKeywords.FINISHED : SearchKeywords.UNFINISHED,
    // no poster?
    !item.posterUrl ? SearchKeywords.NOPOSTER : "",
    // no imdb?
    !item.imdbId ? SearchKeywords.NOIMDB : "",
    // unscraped?
    item.keywords.length || item.description.length ? "" : SearchKeywords.UNSCRAPED,
    // rating?
    !item.rating ? "" : `#${item.rating}`,
    // + all the keywords from imdb
    ...item.keywords,
  ]),
});
