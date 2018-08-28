import moment from 'moment';
import { ItemType } from '../common/enums';

export const parseDate = date => {
    const mom = date && (typeof date === 'string'
        ? moment(date, moment.ISO_8601)
        : moment(date)
    );
    return {
        date: mom && mom.toDate(),
        input: mom ? mom.format('YYYY-MM-DD') : '',
        display: mom ? mom.format('YYYY. MM. DD') : ''
    };
};

export const inputDateAddMonth = (dateStr, months) => {
    const mom = dateStr
        ? moment(dateStr, 'YYYY-MM-DD')
        : moment();
    return mom
        .add(months, 'month')
        .format('YYYY-MM-DD');
};

export const seasonCode = num => (
    num ? `s${num.toString().padStart(2, '0')}` : ''
);

export const getNextSeasonNum = item => (
    item.type === ItemType.MOVIE
        ? null
        : (parseInt(item.lastWatched, 10) || 0) + 1
);

export const maxLength = (str, len) => (
    str.length <= len
        ? str
        : `${str.substr(0, len - 1)}…`
);
