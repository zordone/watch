import { ItemType, NextType, StateType, FinishedType } from '../common/enums';
import { parseDate, season } from './utils';

const itemState = item => {
    const now = new Date();
    const isFinished = item.finished === FinishedType.YES;
    const nextDate = parseDate(item.nextDate);
    const hasDate = Boolean(nextDate.date);
    const isActual = hasDate && (nextDate.date < now);

    if (item.type === ItemType.MOVIE) {
        if (isFinished) {
            return { type: StateType.FINISHED, message: 'Watched.' };
        }
        if (item.inProgress) {
            return { type: StateType.PROGRESS, message: 'In progress.' };
        }
        if (hasDate && isActual) {
            if (item.nextType === NextType.RELEASE) {
                return { type: StateType.RECHECK, message: `Released on ${nextDate.display}, recheck torrent.` };
            }
            if (item.nextType === NextType.AVAILABLE) {
                return { type: StateType.READY, message: 'Ready to watch.' };
            }
        }
        if (hasDate && !isActual) {
            const result = { type: StateType.WAITING, message: `Waiting. Next recheck on ${nextDate.display}.` };
            if (item.nextType === NextType.RELEASE) {
                result.message = `Waiting. Will be available on ${nextDate.display}`;
            } else if (item.nextType === NextType.AVAILABLE) {
                result.message = `Waiting. Will be available on ${nextDate.display}`;
            }
            return result;
        }
    }

    if (item.type === ItemType.SHOW) {
        if (isFinished) {
            return { type: StateType.FINISHED, message: 'Finished.' };
        }
        if (item.inProgress) {
            const currentSeason = season(item.inProgress);
            return { type: StateType.PROGRESS, message: `${currentSeason} in progress.` };
        }
        const nextSeason = season((item.lastWatched + 1) || 1);
        if (hasDate && isActual) {
            if (item.nextType === NextType.START) {
                return { type: StateType.RECHECK, message: `${nextSeason} started on ${nextDate.display}, recheck torrent.` };
            }
            if (item.nextType === NextType.END) {
                return { type: StateType.RECHECK, message: `${nextSeason} ended on ${nextDate.display}, recheck torrent.` };
            }
            if (item.nextType === NextType.AVAILABLE) {
                return { type: StateType.READY, message: `${nextSeason} ready to watch.` };
            }
        }
        if (hasDate && !isActual) {
            if (item.nextType === NextType.START) {
                return { type: StateType.WAITING, message: `Waiting. ${nextSeason} will start on ${nextDate.display}.` };
            }
            if (item.nextType === NextType.END) {
                return { type: StateType.WAITING, message: `Waiting. ${nextSeason} will end on ${nextDate.display}.` };
            }
        }
    }
    console.error('Unkown state', item);
    return { type: StateType.RECHECK, message: 'Time to recheck' };
};

export default itemState;
