import moment from 'moment';
import { ItemType } from '../../common/enums';
import _ from '../../common/lodashReduced';

export const noop = () => {};

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

export const cachePureFunction = (func, debugName = '') => {
    const cache = {};
    return (...args) => {
        const key = JSON.stringify(args);
        if (key in cache) {
            if (debugName) {
                console.debug(debugName, 'Cache hit:', key);
            }
            return cache[key];
        }
        const result = func(...args);
        cache[key] = result;
        if (debugName) {
            console.debug(debugName, 'Cache miss:', key);
        }
        return result;
    };
};

export const mergeArrays = (a, b) => _.uniq(a.concat(b).filter(Boolean));

export const anyChanged = (names, prev, next, debugName = '') => {
    const allNames = Object.keys({ ...prev, ...next });
    const changedNames = (names || allNames)
        .filter(name => {
            const changed = prev[name] !== next[name];
            if (changed && debugName) {
                console.debug(debugName, 'Changed:', name, prev[name], '->', next[name]);
            }
            return changed;
        });
    if (!changedNames.length && debugName) {
        console.debug(debugName, 'Not changed.');
    }
    return changedNames.length > 0;
};

const roman = {
    pattern: /\b([ivxlcdm]+)$/i,
    letters: ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'],
    numbers: [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
};

export const replaceRomanNumbers = (title, concat = false) => {
    const match = (roman.pattern.exec(title) || [])[1];
    if (!match) {
        return title;
    }
    let text = match.toUpperCase();
    let result = 0;
    roman.letters.forEach((letter, index) => {
        while (text.indexOf(letter) === 0) {
            result += roman.numbers[index];
            text = text.replace(letter, '');
        }
    });
    return concat
        ? title.concat(` ${result}`)
        : title.replace(roman.pattern, result);
};

export const slugify = str =>
    replaceRomanNumbers(str)
        .toLowerCase()
        .replace(/[^\w\x80-\xFF]/g, ' ')
        .replace(/\b(the|a|an)\b/g, '')
        .trim()
        .replace(/\s+/g, '-');
