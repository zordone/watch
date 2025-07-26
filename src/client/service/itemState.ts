import { State, Type, Next, Finished, Vali } from "@common/enums";
import { Item, ParsedItem, StateInfo } from "@common/types";
import { NEW_ID } from "./service";
import { parseDate, seasonCode, getNextSeasonNum } from "./utils";

const stateNum = {
  [State.PROGRESS]: 1,
  [State.READY]: 2,
  [State.RECHECK]: 3,
  [State.WAITING]: 4,
  [State.FINISHED]: 5,
  [State.QUIT]: 6,
};

const state = (type: State, parts: string[]): StateInfo => ({
  type,
  num: stateNum[type],
  parts,
});

// eslint-disable-next-line sonarjs/cognitive-complexity -- this is just long, but it's a single responsibility
export const itemState = (item: Item | ParsedItem): StateInfo => {
  const now = new Date();
  const isFinished = item.finished === Finished.YES;
  const nextDate = parseDate(item.nextDate);
  const hasDate = !!nextDate.date;
  const isActual = !!nextDate.date && nextDate.date <= now;

  const withVali = item.withVali !== Vali.NO;
  const recheckWhat = `torrent${withVali ? " and subtitles" : ""}`;

  if (item.type === Type.MOVIE) {
    if (isFinished) {
      return state(State.FINISHED, ["Watched."]);
    }
    if (item.inProgress) {
      return state(State.PROGRESS, ["In progress."]);
    }
    if (hasDate && isActual) {
      if (item.nextType === Next.RELEASE) {
        return state(State.RECHECK, [
          "Released on ",
          nextDate.display,
          `, recheck ${recheckWhat}.`,
        ]);
      }
      if (item.nextType === Next.AVAILABLE) {
        return state(State.READY, ["Ready to watch."]);
      }
      if (item.nextType === Next.RECHECK) {
        return state(State.RECHECK, ["Time to recheck availability."]);
      }
    }
    if (hasDate && !isActual) {
      if (item.nextType === Next.RELEASE) {
        return state(State.WAITING, ["Waiting. Will be released on ", nextDate.display, "."]);
      }
      if (item.nextType === Next.AVAILABLE) {
        return state(State.WAITING, ["Waiting. Will be available on ", nextDate.display, "."]);
      }
      return state(State.WAITING, ["Waiting. Recheck on ", nextDate.display, "."]);
    }
  }

  if (item.type === Type.SHOW) {
    if (isFinished) {
      return state(State.FINISHED, ["Finished."]);
    }
    if (item.finished === Finished.QUIT) {
      return state(State.QUIT, ["Quit."]);
    }
    if (item.inProgress) {
      const currentSeason = seasonCode(item.inProgress);
      return state(State.PROGRESS, [currentSeason, " in progress."]);
    }
    const nextSeason = seasonCode(getNextSeasonNum(item));
    if (hasDate && isActual) {
      if (item.nextType === Next.START) {
        return state(State.RECHECK, [
          nextSeason,
          " started on ",
          nextDate.display,
          `, recheck ${recheckWhat}.`,
        ]);
      }
      if (item.nextType === Next.END) {
        return state(State.RECHECK, [
          nextSeason,
          " ended on ",
          nextDate.display,
          `, recheck ${recheckWhat}.`,
        ]);
      }
      if (item.nextType === Next.AVAILABLE) {
        return state(State.READY, [nextSeason, " ready to watch."]);
      }
      if (item.nextType === Next.RECHECK) {
        return state(State.RECHECK, ["Time to recheck ", nextSeason, "."]);
      }
    }
    if (hasDate && !isActual) {
      if (item.nextType === Next.START) {
        return state(State.WAITING, [
          "Waiting for ",
          nextSeason,
          ". Will start on ",
          nextDate.display,
          ".",
        ]);
      }
      if (item.nextType === Next.END) {
        return state(State.WAITING, [
          "Waiting for ",
          nextSeason,
          ". Will end on ",
          nextDate.display,
          ".",
        ]);
      }
      if (item.nextType === Next.RECHECK) {
        return state(State.WAITING, [
          "Waiting for ",
          nextSeason,
          ". Recheck on ",
          nextDate.display,
          ".",
        ]);
      }
    }
  }
  if (item._id === NEW_ID) {
    return state(State.RECHECK, ["New."]);
  }
  return state(State.RECHECK, ["Time to recheck."]);
};
