import dayjs from "dayjs";
import uniq from "lodash/uniq";
import { Type } from "@common/enums";
import { DateInfo, Item, ParsedItem } from "@common/types";

export const noop: (...args: unknown[]) => unknown = () => {
  // intentionally empty
};

export const isTruthy = <T>(value: T | null | undefined): value is NonNullable<T> => Boolean(value);

export const isEnumValue = <T extends Record<string, string>>(
  enumObject: T,
  value: string | undefined,
): value is T[keyof T] => (value ? Object.values(enumObject).includes(value) : false);

export const emptyToNull = <T>(value: T | null | undefined): T | null =>
  value === null || value === undefined || value === "" ? null : value;

export const parseDate = (dateOrString: Date | string | undefined): DateInfo => {
  if (!dateOrString) {
    return { date: null, input: "", display: "" };
  }
  const date = dayjs(dateOrString);
  return {
    date: date.toDate(),
    input: date.format("YYYY-MM-DD"),
    display: date.format("YYYY.MM.DD"),
  };
};

export const inputDateAddMonth = (dateOrString: Date | string, months: number): string => {
  return dayjs(dateOrString ?? undefined)
    .add(months, "month")
    .format("YYYY-MM-DD");
};

export const seasonCode = (num: number | string | undefined) =>
  num ? `s${num.toString().padStart(2, "0")}` : "";

export const getNextSeasonNum = (item: Item | ParsedItem) =>
  item.type === Type.MOVIE ? undefined : Number(item.lastWatched ?? "0") + 1;

export const getImdbState = (imdbId: string | undefined) => {
  if (!imdbId) return "empty";
  if (["#", "none"].includes(imdbId)) return "none";
  return "valid";
};

export const maxLength = (str: string, len: number) =>
  str.length <= len ? str : `${str.slice(0, len - 1)}…`;

export const mergeArrays = <T>(a: T[], b: T[]) => uniq(a.concat(b).filter(Boolean));

const roman = {
  pattern: /\b([ivxlcdm]+)$/i,
  letters: ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"],
  numbers: [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
};

export const replaceRomanNumbers = (title: string, concat = false) => {
  const match = (roman.pattern.exec(title) ?? [])[1];
  if (!match) {
    return title;
  }
  let text = match.toUpperCase();
  let result = 0;
  roman.letters.forEach((letter, index) => {
    while (text.startsWith(letter)) {
      result += roman.numbers[index];
      text = text.replace(letter, "");
    }
  });
  return concat ? title.concat(` ${result}`) : title.replace(roman.pattern, result.toString());
};

export const slugify = (str: string) =>
  replaceRomanNumbers(str)
    .toLowerCase()
    .replace(/[^\w\x80-\xFF]/g, " ")
    .replace(/\b(the|a|an)\b/g, "")
    .trim()
    .replace(/\s+/g, "-");
