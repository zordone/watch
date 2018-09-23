import React from 'react';
import { ItemType, NextType, StateType, FinishedType, ValiType, Const } from '../../common/enums';
import { parseDate, seasonCode, getNextSeasonNum } from './utils';

const boldRegex = /^(s\d{2}|\d{4}. \d{2}. \d{2})$/i;

const state = (type, parts) => ({
    type,
    message: parts.join(''),
    children: parts.map(part => (
        boldRegex.exec(part)
            ? <strong key={part}>{part}</strong>
            : part
    ))
});

const itemState = item => {
    const now = new Date();
    const isFinished = item.finished === FinishedType.YES;
    const nextDate = parseDate(item.nextDate);
    const hasDate = Boolean(nextDate.date);
    const isActual = hasDate && (nextDate.date <= now);

    const withVali = item.withVali !== ValiType.NO;
    const recheckWhat = `torrent${withVali ? ' and subtitles' : ''}`;

    if (item.type === ItemType.MOVIE) {
        if (isFinished) {
            return state(StateType.FINISHED, ['Watched.']);
        }
        if (item.inProgress) {
            return state(StateType.PROGRESS, ['In progress.']);
        }
        if (hasDate && isActual) {
            if (item.nextType === NextType.RELEASE) {
                return state(StateType.RECHECK, ['Released on ', nextDate.display, `, recheck ${recheckWhat}.`]);
            }
            if (item.nextType === NextType.AVAILABLE) {
                return state(StateType.READY, ['Ready to watch.']);
            }
            if (item.nextType === NextType.RECHECK) {
                return state(StateType.RECHECK, ['Time to recheck availability.']);
            }
        }
        if (hasDate && !isActual) {
            if (item.nextType === NextType.RELEASE) {
                return state(StateType.WAITING, ['Waiting. Will be released on ', nextDate.display, '.']);
            }
            if (item.nextType === NextType.AVAILABLE) {
                return state(StateType.WAITING, ['Waiting. Will be available on ', nextDate.display, '.']);
            }
            return state(StateType.WAITING, ['Waiting. Recheck on ', nextDate.display, '.']);
        }
    }

    if (item.type === ItemType.SHOW) {
        if (isFinished) {
            return state(StateType.FINISHED, ['Finished.']);
        }
        if (item.finished === FinishedType.QUIT) {
            return state(StateType.QUIT, ['Quit.']);
        }
        if (item.inProgress) {
            const currentSeason = seasonCode(item.inProgress);
            return state(StateType.PROGRESS, [currentSeason, ' in progress.']);
        }
        const nextSeason = seasonCode(getNextSeasonNum(item));
        if (hasDate && isActual) {
            if (item.nextType === NextType.START) {
                return state(StateType.RECHECK, [nextSeason, ' started on ', nextDate.display, `, recheck ${recheckWhat}.`]);
            }
            if (item.nextType === NextType.END) {
                return state(StateType.RECHECK, [nextSeason, ' ended on ', nextDate.display, `, recheck ${recheckWhat}.`]);
            }
            if (item.nextType === NextType.AVAILABLE) {
                return state(StateType.READY, [nextSeason, ' ready to watch.']);
            }
            if (item.nextType === NextType.RECHECK) {
                return state(StateType.RECHECK, ['Time to recheck ', nextSeason, '.']);
            }
        }
        if (hasDate && !isActual) {
            if (item.nextType === NextType.START) {
                return state(StateType.WAITING, ['Waiting for ', nextSeason, '. Will start on ', nextDate.display, '.']);
            }
            if (item.nextType === NextType.END) {
                return state(StateType.WAITING, ['Waiting for ', nextSeason, '. Will end on ', nextDate.display, '.']);
            }
            if (item.nextType === NextType.RECHECK) {
                return state(StateType.WAITING, ['Waiting for ', nextSeason, '. Recheck on ', nextDate.display, '.']);
            }
        }
    }
    if (item._id === Const.NEW) {
        return state(StateType.RECHECK, ['New.']);
    }
    console.error('Unkown state', item);
    return state(StateType.RECHECK, ['Time to recheck.']);
};

export default itemState;
